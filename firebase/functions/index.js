
require("dotenv").config();
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const { getDatabase } = require("firebase-admin/database");


admin.initializeApp();
setGlobalOptions({ region: "europe-west" });

/**
 * Triggered when a new user is created in Firebase Auth.
 * Determines the organization, creates a user profile in Firestore, and sets a default role.
 */
exports.onAuthUserCreate = require("firebase-functions/v1").auth.user().onCreate(async (user) => {
    logger.info(`New user created: ${user.uid}`, { email: user.email });

    const { email, uid, displayName, photoURL } = user;
    if (!email) {
        logger.warn(`User ${uid} has no email, cannot assign to organization.`);
        return;
    }

    const db = getFirestore();
    const auth = getAuth();

    // 1. Determine Organization ID from email domain
    const domain = email.split('@')[1];
    const orgsRef = db.collection('orgs');
    const orgSnapshot = await orgsRef.where('domainAllowlist', 'array-contains', domain).limit(1).get();

    if (orgSnapshot.empty) {
        logger.error(`No organization found for domain: ${domain}. User ${uid} not added.`);
        // Optional: You could delete the user if they can't be assigned to any org.
        // await auth.deleteUser(uid);
        return;
    }

    const org = orgSnapshot.docs[0];
    const orgId = org.id;
    const orgData = org.data();
    const defaultRole = orgData.settings?.defaultRole || 'member';

    // 2. Create user profile in Firestore
    const userRef = orgsRef.doc(orgId).collection('users').doc(uid);
    await userRef.set({
        displayName: displayName || email,
        email,
        photoURL: photoURL || null,
        role: defaultRole,
        isActive: true,
        createdAt: FieldValue.serverTimestamp(),
        lastLoginAt: FieldValue.serverTimestamp(),
        dnd: false,
        presenceHint: 'remote',
        birthday: null,
        notificationTokens: [],
        termsAcceptedAt: null,
        privacyAcceptedAt: null,
        orgId: orgId, // Denormalize for security rules
    }, { merge: true });

    // 3. Set custom claims for role-based access control
    await auth.setCustomUserClaims(uid, { orgId, role: defaultRole });

    // 4. Write Audit Event
    await db.collection('audits').add({
        orgId,
        actorUid: uid,
        action: 'user.create',
        targetPath: userRef.path,
        at: FieldValue.serverTimestamp(),
    });

    logger.info(`User ${uid} successfully onboarded to organization ${orgId} with role ${defaultRole}.`);
});

/**
 * Triggered when a user is deleted from Firebase Auth.
 * Anonymizes the user's data in Firestore.
 */
exports.onAuthUserDelete = require("firebase-functions/v1").auth.user().onDelete(async (user) => {
    logger.info(`User deleted: ${user.uid}`);
    const userClaims = user.customClaims || {};
    const orgId = userClaims.orgId;

    if (!orgId) {
        logger.warn(`User ${user.uid} has no orgId claim, cannot anonymize data.`);
        return;
    }

    const db = getFirestore();
    const userRef = db.collection('orgs').doc(orgId).collection('users').doc(user.uid);
    
    // Anonymize user data instead of deleting, to maintain data integrity
    await userRef.update({
        isActive: false,
        displayName: 'Deleted User',
        email: `deleted-${user.uid}@example.com`,
        photoURL: null,
        notificationTokens: [],
        dnd: false,
        role: 'member',
        birthday: null
    });
    
     // Write Audit Event
    await db.collection('audits').add({
        orgId,
        actorUid: 'system', // Deletion can be initiated by user or admin
        action: 'user.delete.anonymize',
        targetPath: userRef.path,
        at: FieldValue.serverTimestamp(),
    });

    logger.info(`Anonymized data for user ${user.uid} in org ${orgId}.`);
});


/**
 * Mirrors presence status from Realtime Database to Firestore.
 */
exports.mirrorPresence = require("firebase-functions/v1").database.ref('/status/{orgId}/{uid}')
    .onWrite(async (change, context) => {
        const status = change.after.val();
        const { orgId, uid } = context.params;
        const userRef = getFirestore().collection('orgs').doc(orgId).collection('users').doc(uid);

        try {
            if (!change.after.exists()) {
                await userRef.update({ presenceHint: 'away', lastSeen: FieldValue.serverTimestamp() });
                logger.info(`User ${uid} went offline.`);
                return null;
            }

            const presenceHint = status.online ? 'office' : 'away'; // Simplified logic
            await userRef.update({ 
                presenceHint: presenceHint,
                lastSeen: FieldValue.serverTimestamp() 
            });
            logger.info(`Updated presence for user ${uid} to ${presenceHint}.`);
            return null;
        } catch (error) {
            logger.error(`Failed to mirror presence for user ${uid}`, error);
            return null;
        }
});


/**
 * Runs on a schedule (e.g., every hour) to mark expired invites.
 */
exports.rotateExpiredInvites = require("firebase-functions/v1").pubsub.schedule('every 60 minutes').onRun(async () => {
    logger.info('Running rotateExpiredInvites cron job.');
    const db = getFirestore();
    const now = FieldValue.serverTimestamp();
    const invitesRef = db.collectionGroup('invites');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const snapshot = await invitesRef.where('status', '==', 'pending').where('createdAt', '<', sevenDaysAgo).get();

    if (snapshot.empty) {
        logger.info('No expired invites to rotate.');
        return null;
    }

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { status: 'expired' });
    });

    await batch.commit();
    logger.info(`Expired ${snapshot.size} invites.`);
    return null;
});


/**
 * GDPR Data Export: Aggregates a user's data and provides a download link.
 */
exports.exportMyData = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'You must be logged in.');
    }
    const uid = request.auth.uid;
    const orgId = request.auth.token.orgId;

    if (!orgId) {
        throw new HttpsError('permission-denied', 'User is not associated with an organization.');
    }

    logger.info(`Starting data export for user ${uid} in org ${orgId}`);
    const db = getFirestore();
    const storage = admin.storage();

    const userRef = db.collection('orgs').doc(orgId).collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
        throw new HttpsError('not-found', 'User data not found.');
    }

    const userData = userDoc.data();
    const exportData = {
        profile: userData,
        // In a real scenario, you'd also query other collections for related data
    };

    const bucket = storage.bucket();
    const fileName = `export-${uid}-${Date.now()}.json`;
    const file = bucket.file(`user-exports/${uid}/${fileName}`);

    await file.save(JSON.stringify(exportData, null, 2), {
        contentType: 'application/json',
    });
    
    const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    logger.info(`Data export for user ${uid} created. URL: ${url}`);
    return { downloadUrl: url };
});


/**
 * Account Deletion: Anonymizes user data and deletes the auth user.
 */
exports.deleteMyAccount = onCall(async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'You must be logged in.');
    }

    const uid = request.auth.uid;
    logger.info(`Starting account deletion for user ${uid}`);

    try {
        // The onAuthUserDelete function will handle data anonymization.
        // This function just needs to trigger the auth deletion.
        await getAuth().deleteUser(uid);
        logger.info(`Auth user ${uid} deleted. Anonymization will be triggered.`);
        return { message: 'Account deletion process initiated.' };
    } catch (error) {
        logger.error(`Error deleting auth user ${uid}:`, error);
        throw new HttpsError('internal', 'Could not delete account.');
    }
});

/**
 * Enforce Domain Allowlist on Invite Accept (example implementation)
 */
exports.enforceDomainAllowlist = onCall(async(request) => {
     if (!request.auth) {
        throw new HttpsError('unauthenticated', 'You must be logged in.');
    }
    const email = request.auth.token.email;
    const { orgId } = request.data;
    
    const orgDoc = await getFirestore().collection('orgs').doc(orgId).get();
    if (!orgDoc.exists) {
        throw new HttpsError('not-found', 'Organization not found.');
    }

    const allowlist = orgDoc.data().domainAllowlist || [];
    const userDomain = email.split('@')[1];

    if (!allowlist.includes(userDomain)) {
         throw new HttpsError('permission-denied', `Your email domain (${userDomain}) is not allowed for this organization.`);
    }

    return { success: true };
})

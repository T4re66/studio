const functions = require('firebase-functions/v2');
const admin = require('firebase-admin');
const { setGlobalOptions } = require("firebase-functions/v2");

admin.initializeApp();
setGlobalOptions({ region: "europe-west" });


// Hardcode-Liste für Admin-E-Mails. Hier können Admins eingetragen werden.
const ADMIN_EMAILS = new Set([
  // "dein.admin@firma.ch", 
]);

/**
 * Triggered when a new user is created in Firebase Auth.
 * Creates a user profile in Firestore with a default or admin role.
 */
exports.onAuthUserCreate = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(user.uid);
  
  const doc = await userRef.get();

  // Nur anlegen, wenn das Dokument noch nicht existiert
  if (!doc.exists) {
    const role = ADMIN_EMAILS.has((user.email || '').toLowerCase()) ? 'admin' : 'member';
    
    return userRef.set({
      displayName: user.displayName || '',
      email: (user.email || '').toLowerCase(),
      photoURL: user.photoURL || '',
      role: role,
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } else {
    // Falls das Dokument bereits existiert (z.B. durch eine Einladung), nur Login-Zeit aktualisieren.
     return userRef.update({
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
     });
  }
});


/**
 * Triggered when a user is deleted from Firebase Auth.
 * Anonymizes the user's data in Firestore.
 */
exports.onAuthUserDelete = functions.auth.user().onDelete(async (user) => {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(user.uid);
  
  // Anonymize user data instead of deleting, to maintain data integrity
  return userRef.update({
      isActive: false,
      displayName: 'Gelöschter Benutzer',
      email: `deleted-${user.uid}@example.com`,
      photoURL: admin.firestore.FieldValue.delete(),
      birthday: admin.firestore.FieldValue.delete(),
  });
});

const functions = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();

// Set region for all functions
functions.setGlobalOptions({ region: "europe-west" });

// Hardcoded list of admin emails
const ADMIN_EMAILS = new Set(["founder@officezen.ch"]);

exports.onAuthUserCreate = functions.auth.user().onCreate(async (user) => {
  const db = admin.firestore();
  const userRef = db.collection('users').doc(user.uid);
  
  const doc = await userRef.get();

  // Only create the user document if it doesn't already exist.
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
    // If the document already exists (e.g., from an invite), just update the login time.
     return userRef.update({
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
     });
  }
});


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

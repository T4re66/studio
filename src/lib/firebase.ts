import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "officezen-prod",
  appId: "1:550306371720:web:d38e213381283a5416b2b4",
  storageBucket: "officezen-prod.appspot.com",
  apiKey: "AIzaSyAz_T9_OPPAoTlLgsjD-sPyZhlc4s8d-5M",
  authDomain: "officezen-prod.firebaseapp.com",
  messagingSenderId: "550306371720",
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const res = await signInWithPopup(auth, provider);
    return res.user;
  } catch (error) {
    console.error("Error during Google login:", error);
    throw error;
  }
}

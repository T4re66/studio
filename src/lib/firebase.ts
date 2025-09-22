import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-2690327910-465d5",
  appId: "1:547939753801:web:ec6d65567d0ddc09264498",
  apiKey: "AIzaSyCniorXfxA-sdXX7yBKviMZMCEAnuw98KU",
  authDomain: "studio-2690327910-465d5.firebaseapp.com",
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

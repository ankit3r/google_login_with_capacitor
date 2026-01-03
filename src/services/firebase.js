import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBAx1U1UjL_2Zcv5WK5IA7tGFRrDkNuDhE",
  authDomain: "react--login-4c527.firebaseapp.com",
  projectId: "react--login-4c527",
  storageBucket: "react--login-4c527.firebasestorage.app",
  messagingSenderId: "1079199503518",
  appId: "1:1079199503518:web:dae5740f6bd35f698d178f",
  measurementId: "G-KD36HZSGMV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.addScope('email');
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;

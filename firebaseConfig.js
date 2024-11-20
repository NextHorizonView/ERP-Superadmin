// firebaseConfig.js
import { initializeApp, createUserWithEmailAndPassword } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'schoolerp-a74fb.firebaseapp.com',
  projectId: 'schoolerp-a74fb',
  storageBucket: 'gs://schoolerp-a74fb.firebasestorage.app',
  messagingSenderId: '198618808281',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage };

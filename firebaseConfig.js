// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "localhost",
  projectId: "schoolerp-a74fb",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "198618808281",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };

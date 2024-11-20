// pages/api/createSchool.ts
import admin from "firebase-admin";
import { db } from "@/firebaseConfig"; // Ensure this is configured with Firestore
import { setDoc, doc } from "firebase/firestore";
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { schoolName, schoolEmail, schoolPassword, schoolLogo, schoolAddress, schoolModuleBoolean } = req.body;

      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: schoolEmail,
        password: schoolPassword,
        displayName: schoolName,
      });

      // Set custom claims for the user
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        role: "admin", // Assign the 'schoolAdmin' role
      });

      // Generate custom token
      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      // Add the new school to Firestore using the Auth UID as the document ID
      const docRef = doc(db, "schools", userRecord.uid);
      await setDoc(docRef, {
        schoolName,
        schoolEmail,
        schoolId: userRecord.uid,
        schoolLogo,
        schoolAddress,
        schoolModuleBoolean,
        role: "admin", // Store the role in Firestore for easy lookup
      });

      // Return both a success message and the custom token
      res.status(200).json({ message: "School created successfully!", customToken });
    } catch (error) {
      console.error("Error creating school:", error);
      res.status(500).json({ error: "Error creating school" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
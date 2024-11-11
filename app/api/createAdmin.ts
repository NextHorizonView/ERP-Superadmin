// api/createAdmin.ts (Server-side API route)
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
        const { superAdminName, superAdminEmail, password, superAdminProfilePhoneNumber, profileImgUrl } = req.body;

      // Create user in Firebase Auth
      const userRecord = await admin.auth().createUser({
        email: superAdminEmail,
        password,
        displayName: superAdminName,
      });

      // Generate custom token
      const customToken = await admin.auth().createCustomToken(userRecord.uid);

      // Add the new admin to Firestore using the Auth UID as the document ID
      const docRef = doc(db, "superadmins", userRecord.uid);
      await setDoc(docRef, {
        superAdminId: userRecord.uid,
        superAdminName,
        superAdminEmail,
        superAdminProfileImg: profileImgUrl || "",
        superAdminProfilePhoneNumber,
      });

      res.status(200).json({ message: "Super admin created successfully!" });
    } catch (error) {
      console.error("Error creating super admin:", error);
      res.status(500).json({ error: "Error creating super admin" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const deleteAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { superAdminId } = req.body;

    if (!superAdminId) {
      return res.status(400).json({ error: 'superAdminId is required' });
    }

    try {
      const adminAuth = admin.auth(); // Initialize Firebase Admin Auth
      await adminAuth.deleteUser(superAdminId); // Delete the user from Firebase Auth
      res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
      console.error('Error deleting admin:', error);
      res.status(500).json({ error: 'Failed to delete admin' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

export default deleteAdmin;

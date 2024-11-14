"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/Loader";
import { Trash2, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { db, storage } from "@/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import admin from "firebase-admin";

interface Admin {
  id: number;
  firestoreId?: string;
  superAdminId: string;
  superAdminName: string;
  superAdminEmail: string;
  superAdminProfileImg: string;
  superAdminProfilePhoneNumber: string;
  password: string;
  isEditing: boolean;
  superAdminProfileImgFile?: File | null;
}

export default function SuperAdminPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState<Admin>({
    id: Date.now(),
    superAdminId: "",
    superAdminName: "",
    superAdminEmail: "",
    superAdminProfileImg: "",
    superAdminProfilePhoneNumber: "",
    password: "",
    isEditing: true,
    superAdminProfileImgFile: null,
  });
  const [showNewAdminForm, setShowNewAdminForm] = useState(false);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});

  const adminsCollection = collection(db, "superadmins");

  // Fetch admins from Firestore
  useEffect(() => {
    const fetchAdmins = async () => {
      const querySnapshot = await getDocs(adminsCollection);
      const fetchedAdmins: Admin[] = querySnapshot.docs.map((doc, index) => ({
        id: index + 1,
        firestoreId: doc.id,
        superAdminId: doc.data().superAdminId || "",
        superAdminName: doc.data().superAdminName || "",
        superAdminEmail: doc.data().superAdminEmail || "",
        superAdminProfileImg: doc.data().superAdminProfileImg || "",
        superAdminProfilePhoneNumber: doc.data().superAdminProfilePhoneNumber || "",
        password: "",
        isEditing: false,
      }));
      setAdmins(fetchedAdmins);
    };
    fetchAdmins();
  }, []);

  const toggleEdit = (id: number) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === id ? { ...admin, isEditing: !admin.isEditing } : admin
      )
    );
  };

  const handleInputChange = (id: number, field: keyof Admin, value: string) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === id ? { ...admin, [field]: value } : admin
      )
    );
  };

  const handleFileChange = async (id: number, file: File | null) => {
    if (file) {
      const storageRef = ref(storage, `superadminProfileImages/${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin.id === id ? { ...admin, superAdminProfileImg: imageUrl } : admin
        )
      );
    }
  };

  const saveChanges = async (id: number) => {
    setLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
    const admin = admins.find((a) => a.id === id);
    if (admin) {
      if (!admin.firestoreId) {
        const docRef = await addDoc(adminsCollection, {
          superAdminId: admin.superAdminId,
          superAdminName: admin.superAdminName,
          superAdminEmail: admin.superAdminEmail,
          superAdminProfileImg: admin.superAdminProfileImg,
          superAdminProfilePhoneNumber: admin.superAdminProfilePhoneNumber,
        });
        setAdmins((prevAdmins) =>
          prevAdmins.map((a) =>
            a.id === id ? { ...a, firestoreId: docRef.id, isEditing: false } : a
          )
        );
      } else {
        const adminDoc = doc(db, "superadmins", admin.firestoreId);
        await updateDoc(adminDoc, {
          superAdminName: admin.superAdminName,
          superAdminEmail: admin.superAdminEmail,
          superAdminProfileImg: admin.superAdminProfileImg,
          superAdminProfilePhoneNumber: admin.superAdminProfilePhoneNumber,
        });
        setAdmins((prevAdmins) =>
          prevAdmins.map((a) =>
            a.id === id ? { ...a, isEditing: false } : a
          )
        );
      }
      setLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
      console.log(`Changes saved for admin with ID: ${id}`);
    }
  };
  const deleteAdmin = async (id: number) => {
    setLoading((prevLoading) => ({ ...prevLoading, [id]: true }));
    const admin = admins.find((a) => a.id === id);
    if (admin?.firestoreId) {
      try {
        // Delete the admin from Firestore
        const adminDoc = doc(db, "superadmins", admin.firestoreId);
        await deleteDoc(adminDoc);
        
        // Send a request to the backend API to delete the admin from Firebase Authentication
        if (admin.superAdminId) {
          const response = await fetch('/api/deleteAdmin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ superAdminId: admin.superAdminId }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to delete admin from Firebase Authentication');
          }
          console.log(`User with ID ${admin.superAdminId} deleted from Firebase Authentication`);
        }
  
        // Remove admin from state
        setAdmins(admins.filter((admin) => admin.id !== id));
      } catch (error) {
        console.error("Error deleting admin:", error);
      }
    }
    setLoading((prevLoading) => ({ ...prevLoading, [id]: false }));
  };
  

  const addNewAdmin = async () => {
    setLoading((prevLoading) => ({ ...prevLoading, newAdmin: true }));
    try {
      let profileImgUrl = "";
      if (newAdmin.superAdminProfileImgFile) {
        const storageRef = ref(storage, `superadminProfileImages/${newAdmin.superAdminProfileImgFile.name}`);
        await uploadBytes(storageRef, newAdmin.superAdminProfileImgFile);
        profileImgUrl = await getDownloadURL(storageRef);
      }
  
      const response = await fetch("http://localhost:3000/api/createAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          superAdminName: newAdmin.superAdminName,
          superAdminEmail: newAdmin.superAdminEmail,
          password: newAdmin.password,
          superAdminProfilePhoneNumber: newAdmin.superAdminProfilePhoneNumber,
          profileImgUrl,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Super admin created successfully with custom token:", data.customToken);
        setAdmins((prevAdmins) => [
          ...prevAdmins,
          { ...newAdmin, firestoreId: data.uid, superAdminId: data.uid, superAdminProfileImg: profileImgUrl, isEditing: false },
        ]);
        setNewAdmin({
          id: Date.now(),
          superAdminId: "",
          superAdminName: "",
          superAdminEmail: "",
          superAdminProfileImg: "",
          superAdminProfilePhoneNumber: "",
          password: "",
          isEditing: true,
        });
        setShowNewAdminForm(false);
      } else {
        console.error("Error creating super admin:", data.error);
      }
    } catch (error) {
      console.error("Error creating super admin:", error);
    }
    setLoading((prevLoading) => ({ ...prevLoading, newAdmin: false }));
  };

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-4 min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Super Admin Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {admins.map((admin) => (
              <li key={admin.id} className="bg-card p-3 sm:p-4 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
                <div className="w-full sm:w-auto">
                  {admin.isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={admin.superAdminName}
                        onChange={(e) => handleInputChange(admin.id, "superAdminName", e.target.value)}
                        placeholder="SuperAdmin Name"
                      />
                      <Input
                        value={admin.superAdminEmail}
                        onChange={(e) => handleInputChange(admin.id, "superAdminEmail", e.target.value)}
                        placeholder="SuperAdmin Email"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(admin.id, e.target.files?.[0] || null)}
                      />
                      <Input
                        value={admin.superAdminProfilePhoneNumber}
                        onChange={(e) => handleInputChange(admin.id, "superAdminProfilePhoneNumber", e.target.value)}
                        placeholder="Phone Number"
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium">{admin.superAdminName}</h4>
                      <p className="text-sm text-muted-foreground">{admin.superAdminEmail}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {admin.isEditing ? (
                   <Button
                   onClick={() => saveChanges(admin.id)}
                   disabled={loading[admin.id]}
                 >
                   {loading[admin.id] ? <Loader /> : "Save"}
                 </Button>
                  ) : (
                    <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => toggleEdit(admin.id)}>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button className="w-full sm:w-auto" variant="destructive" size="sm" onClick={() => deleteAdmin(admin.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {!showNewAdminForm && (
            <div className="w-full mt-3 sm:mt-5 flex justify-center">
              <Button onClick={() => setShowNewAdminForm(true)}>Add New Admin</Button>
            </div>
          )}
          {showNewAdminForm && (
            <div className="w-full mt-4 flex flex-col gap-3 sm:gap-4">
              <Input
                value={newAdmin.superAdminName}
                onChange={(e) => setNewAdmin({ ...newAdmin, superAdminName: e.target.value })}
                placeholder="SuperAdmin Name"
              />
              <Input
                value={newAdmin.superAdminEmail}
                onChange={(e) => setNewAdmin({ ...newAdmin, superAdminEmail: e.target.value })}
                placeholder="SuperAdmin Email"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setNewAdmin({ ...newAdmin, superAdminProfileImgFile: e.target.files?.[0] || null })}
              />
              <Input
                value={newAdmin.superAdminProfilePhoneNumber}
                onChange={(e) => setNewAdmin({ ...newAdmin, superAdminProfilePhoneNumber: e.target.value })}
                placeholder="Phone Number"
              />
              <Input
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                placeholder="Password"
                type="password"
              />
              <Button onClick={addNewAdmin}>Save New Admin</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { auth, db, storage } from "@/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
      console.log(`Changes saved for admin with ID: ${id}`);
    }
  };

  const deleteAdmin = async (id: number) => {
    const admin = admins.find((a) => a.id === id);
    if (admin?.firestoreId) {
      const adminDoc = doc(db, "superadmins", admin.firestoreId);
      await deleteDoc(adminDoc);
    }
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  const addNewAdmin = async () => {
    try {
      let profileImgUrl = "";
      if (newAdmin.superAdminProfileImgFile) {
        const storageRef = ref(storage, `superadminProfileImages/${newAdmin.superAdminProfileImgFile.name}`);
        await uploadBytes(storageRef, newAdmin.superAdminProfileImgFile);
        profileImgUrl = await getDownloadURL(storageRef);
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newAdmin.superAdminEmail,
        newAdmin.password
      );
      const uid = userCredential.user.uid;

      const docRef = await addDoc(adminsCollection, {
        superAdminId: uid,
        superAdminName: newAdmin.superAdminName,
        superAdminEmail: newAdmin.superAdminEmail,
        superAdminProfileImg: profileImgUrl,
        superAdminProfilePhoneNumber: newAdmin.superAdminProfilePhoneNumber,
      });

      setAdmins((prevAdmins) => [
        ...prevAdmins,
        { ...newAdmin, firestoreId: docRef.id, superAdminId: uid, superAdminProfileImg: profileImgUrl, isEditing: false },
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
      console.log("Super admin created successfully!");
    } catch (error) {
      console.error("Error creating super admin:", error);
    }
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
                    <Button className="w-full sm:w-auto" variant="outline" size="sm" onClick={() => saveChanges(admin.id)}>
                      Save
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

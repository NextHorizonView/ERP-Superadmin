"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { auth, db } from "@/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

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
  });
  const [showNewAdminForm, setShowNewAdminForm] = useState(false); // State to control form visibility

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

  const handleFileChange = (id: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin.id === id ? { ...admin, superAdminProfileImg: imageUrl } : admin
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async (id: number) => {
    const admin = admins.find((a) => a.id === id);
    if (admin) {
      if (!admin.firestoreId) {
        // Add new admin to Firestore
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
        // Update existing admin in Firestore
        const adminDoc = doc(db, "superadmins", admin.firestoreId);
        await updateDoc(adminDoc, {
          superAdminId: admin.superAdminId,
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
      await deleteDoc(adminDoc); // Delete from Firestore
    }
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  const addNewAdmin = async () => {
    try {
      // Create the super admin user in Firebase Authentication
      await createUserWithEmailAndPassword(
        auth,
        newAdmin.superAdminEmail,
        newAdmin.password
      );
  
      // Add admin data to Firestore
      const docRef = await addDoc(adminsCollection, {
        superAdminId: newAdmin.superAdminId,
        superAdminName: newAdmin.superAdminName,
        superAdminEmail: newAdmin.superAdminEmail,
        superAdminProfileImg: newAdmin.superAdminProfileImg,
        superAdminProfilePhoneNumber: newAdmin.superAdminProfilePhoneNumber,
      });
  
      setAdmins((prevAdmins) => [
        ...prevAdmins,
        { ...newAdmin, firestoreId: docRef.id, isEditing: false },
      ]);
  
      // Clear the newAdmin state to reset the form fields
      setNewAdmin({
        id: Date.now(),
        superAdminId: "",
        superAdminName: "",
        superAdminEmail: "",
        superAdminProfileImg: "",
        superAdminProfilePhoneNumber: "",
        password: "", // Clear password
        isEditing: true,
      });
      setShowNewAdminForm(false); // Hide the form after adding the admin
      console.log("Super admin created successfully!");
    } catch (error) {
      console.error("Error creating super admin:", error);
      // Handle errors here (e.g., show a toast notification)
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
              <li
                key={admin.id}
                className="bg-card p-3 sm:p-4 rounded flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4"
              >
                <div className="w-full sm:w-auto">
                  {admin.isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={admin.superAdminId}
                        onChange={(e) =>
                          handleInputChange(admin.id, "superAdminId", e.target.value)
                        }
                        placeholder="SuperAdmin ID"
                      />
                      <Input
                        value={admin.superAdminName}
                        onChange={(e) =>
                          handleInputChange(admin.id, "superAdminName", e.target.value)
                        }
                        placeholder="SuperAdmin Name"
                      />
                      <Input
                        value={admin.superAdminEmail}
                        onChange={(e) =>
                          handleInputChange(admin.id, "superAdminEmail", e.target.value)
                        }
                        placeholder="SuperAdmin Email"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleFileChange(admin.id, e.target.files?.[0] || null)
                        }
                      />
                      <Input
                        value={admin.superAdminProfilePhoneNumber}
                        onChange={(e) =>
                          handleInputChange(admin.id, "superAdminProfilePhoneNumber", e.target.value)
                        }
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
                      className="w-full sm:w-auto"
                      variant="outline"
                      size="sm"
                      onClick={() => saveChanges(admin.id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      className="w-full sm:w-auto"
                      variant="outline"
                      size="sm"
                      onClick={() => toggleEdit(admin.id)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button
                    className="w-full sm:w-auto"
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteAdmin(admin.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {showNewAdminForm && (
            <div className="space-y-2 mt-4">
              <Input
                value={newAdmin.superAdminId}
                onChange={(e) =>
                  setNewAdmin((prevAdmin) => ({ ...prevAdmin, superAdminId: e.target.value }))
                }
                placeholder="SuperAdmin ID"
              />
              <Input
                value={newAdmin.superAdminName}
                onChange={(e) =>
                  setNewAdmin((prevAdmin) => ({ ...prevAdmin, superAdminName: e.target.value }))
                }
                placeholder="SuperAdmin Name"
              />
              <Input
                value={newAdmin.superAdminEmail}
                onChange={(e) =>
                  setNewAdmin((prevAdmin) => ({ ...prevAdmin, superAdminEmail: e.target.value }))
                }
                placeholder="SuperAdmin Email"
              />
              <Input
                value={newAdmin.superAdminProfileImg}
                onChange={(e) =>
                  setNewAdmin((prevAdmin) => ({ ...prevAdmin, superAdminProfileImg: e.target.value }))
                }
                placeholder="Profile Image URL"
              />
              <Input
                value={newAdmin.superAdminProfilePhoneNumber}
                onChange={(e) =>
                  setNewAdmin((prevAdmin) => ({
                    ...prevAdmin,
                    superAdminProfilePhoneNumber: e.target.value,
                  }))
                }
                placeholder="Phone Number"
              />
              <Input
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin((prevAdmin) => ({ ...prevAdmin, password: e.target.value }))
                }
                placeholder="Password"
                type="password"
              />
              <Button onClick={addNewAdmin} className="w-full">
                Add New Super Admin
              </Button>
            </div>
          )}
          {!showNewAdminForm && (
            <Button onClick={() => setShowNewAdminForm(true)} className="w-full mt-4">
              Add New Admin
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

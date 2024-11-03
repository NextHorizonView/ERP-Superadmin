"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db, auth } from "@/firebaseConfig"; 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Trash2, Edit3 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

interface School {
  id: string;
  firestoreId?: string;
  schoolId: string;
  schoolName: string;
  schoolEmail: string;
  schoolPassword: string; // Store password securely, do not display it
  schoolLogo: string;
  schoolAddress: string;
  schoolModuleBoolean: boolean;
  isEditing: boolean;
}

export default function SchoolDashboard() {
  const [schools, setSchools] = useState<School[]>([]);
  const [newSchool, setNewSchool] = useState<School>({
    id: uuidv4(),
    schoolId: "",
    schoolName: "",
    schoolEmail: "",
    schoolPassword: "", // Initialize password
    schoolLogo: "",
    schoolAddress: "",
    schoolModuleBoolean: true,
    isEditing: true,
  });
  const [isAddingNewSchool, setIsAddingNewSchool] = useState(false); // New state variable to toggle visibility

  const schoolsCollection = collection(db, "schools");

  useEffect(() => {
    const fetchSchools = async () => {
      const querySnapshot = await getDocs(schoolsCollection);
      const fetchedSchools: School[] = querySnapshot.docs.map((doc) => ({
        id: uuidv4(),
        firestoreId: doc.id,
        schoolId: doc.data().schoolId || "",
        schoolName: doc.data().schoolName || "",
        schoolEmail: doc.data().schoolEmail || "",
        schoolPassword: "", // Do not fetch passwords
        schoolLogo: doc.data().schoolLogo || "",
        schoolAddress: doc.data().schoolAddress || "",
        schoolModuleBoolean: doc.data().schoolModuleBoolean || false,
        isEditing: false,
      }));
      setSchools(fetchedSchools);
    };
    fetchSchools();
  }, []);

  const toggleEdit = (id: string) => {
    setSchools((prevSchools) =>
      prevSchools.map((school) =>
        school.id === id ? { ...school, isEditing: !school.isEditing } : school
      )
    );
  };

  const handleInputChange = (id: string, field: keyof School, value: string | boolean) => {
    setSchools((prevSchools) =>
      prevSchools.map((school) =>
        school.id === id ? { ...school, [field]: value } : school
      )
    );
  };



  const saveChanges = async (id: string) => {
    const school = schools.find((s) => s.id === id);
    if (school) {
      if (!school.firestoreId) {
        // Create a new user in Firebase Authentication
        try {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            school.schoolEmail,
            school.schoolPassword 
          );
  
          // Add school to Firestore with Auth UID (not displayed in UI)
          const docRef = await addDoc(schoolsCollection, {
            schoolId: school.schoolId,
            schoolName: school.schoolName,
            schoolEmail: school.schoolEmail,
            authUid: user.uid, // Use the uid here
            schoolLogo: school.schoolLogo,
            schoolAddress: school.schoolAddress,
            schoolModuleBoolean: school.schoolModuleBoolean,
            schoolPassword: school.schoolPassword
          });
          setSchools((prevSchools) =>
            prevSchools.map((s) =>
              s.id === id ? { ...s, firestoreId: docRef.id, isEditing: false } : s
            )
          );
        } catch (error) {
          console.error("Error creating school in Auth:", error);
        }
      } else {
        // Update existing school in Firestore
        const schoolDoc = doc(db, "schools", school.firestoreId);
        await updateDoc(schoolDoc, {
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          schoolEmail: school.schoolEmail,
          schoolLogo: school.schoolLogo,
          schoolAddress: school.schoolAddress,
          schoolModuleBoolean: school.schoolModuleBoolean,
          schoolPassword: school.schoolPassword // Update password if changed
        });
        setSchools((prevSchools) =>
          prevSchools.map((s) =>
            s.id === id ? { ...s, isEditing: false } : s
          )
        );
      }
      console.log(`Changes saved for school with ID: ${id}`);
    }
  };
  

  const deleteSchool = async (id: string) => {
    const school = schools.find((s) => s.id === id);
    if (school?.firestoreId) {
      const schoolDoc = doc(db, "schools", school.firestoreId);
      await deleteDoc(schoolDoc);
    }
    setSchools(schools.filter((school) => school.id !== id));
  };
  // const deleteSchool = async (id: string) => {
  //   const school = schools.find((s) => s.id === id);
  //   if (school) {
  //     try {
  //       if (school.firestoreId && school.schoolEmail) {
  //         // Delete the user from Firebase Authentication
  //         const user = await auth.getUser(school.authUid); // Fetch the user object using the UID
  //         if (user) {
  //           await deleteUser(user); // Delete the user from Auth
  //         }
          
  //         // Delete the school document from Firestore
  //         const schoolDoc = doc(db, "schools", school.firestoreId);
  //         await deleteDoc(schoolDoc);
  //       }
  //       // Update the local state to remove the deleted school
  //       setSchools(schools.filter((s) => s.id !== id));
  //       console.log(`Deleted school with ID: ${id}`);
  //     } catch (error) {
  //       console.error("Error deleting school:", error);
  //     }
  //   }
  // };

 

  const addNewSchool = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        newSchool.schoolEmail,
        newSchool.schoolPassword // Use the password from the new school form
      );
  
      const docRef = await addDoc(schoolsCollection, {
        schoolId: newSchool.schoolId,
        schoolName: newSchool.schoolName,
        schoolEmail: newSchool.schoolEmail,
        authUid: user.uid, // Store Auth UID in Firestore
        schoolLogo: newSchool.schoolLogo,
        schoolAddress: newSchool.schoolAddress,
        schoolModuleBoolean: newSchool.schoolModuleBoolean,
        schoolPassword: newSchool.schoolPassword // Save the password securely in Firestore
      });
  
      setSchools((prevSchools) => [
        ...prevSchools,
        {
          id: uuidv4(), // Create a new id for the school
          firestoreId: docRef.id,
          schoolId: newSchool.schoolId,
          schoolName: newSchool.schoolName,
          schoolEmail: newSchool.schoolEmail,
          schoolPassword: "", // Do not fetch or store passwords
          schoolLogo: newSchool.schoolLogo,
          schoolAddress: newSchool.schoolAddress,
          schoolModuleBoolean: newSchool.schoolModuleBoolean,
          isEditing: false, // Set editing to false by default
        },
      ]);
  
      // Clear the new school input fields after successful addition
      setNewSchool({
        id: uuidv4(),
        schoolId: "",
        schoolName: "",
        schoolEmail: "",
        schoolPassword: "",
        schoolLogo: "",
        schoolAddress: "",
        schoolModuleBoolean: true,
        isEditing: true,
      });
      setIsAddingNewSchool(false); // Hide the new school fields after adding
    } catch (error) {
      console.error("Error adding new school:", error);
    }
  };
  

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-4 min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            School Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {schools.map((school) => (
              <li key={school.id} className="bg-card p-3 sm:p-4 rounded flex flex-col gap-3">
                <div className="w-full">
                  {school.isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={school.schoolId}
                        onChange={(e) => handleInputChange(school.id, "schoolId", e.target.value)}
                        placeholder="School ID"
                      />
                      <Input
                        value={school.schoolName}
                        onChange={(e) => handleInputChange(school.id, "schoolName", e.target.value)}
                        placeholder="School Name"
                      />
                      <Input
                        value={school.schoolEmail}
                        onChange={(e) => handleInputChange(school.id, "schoolEmail", e.target.value)}
                        placeholder="School Email"
                      />
                      <Input
                        type="password" // Use password type for security
                        value={school.schoolPassword}
                        onChange={(e) => handleInputChange(school.id, "schoolPassword", e.target.value)}
                        placeholder="School Password"
                      />
                      <Input
                        value={school.schoolLogo}
                        onChange={(e) => handleInputChange(school.id, "schoolLogo", e.target.value)}
                        placeholder="Logo URL"
                      />
                      <Input
                        value={school.schoolAddress}
                        onChange={(e) => handleInputChange(school.id, "schoolAddress", e.target.value)}
                        placeholder="Address"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={school.schoolModuleBoolean}
                          onChange={(e) => handleInputChange(school.id, "schoolModuleBoolean", e.target.checked)}
                        />
                        <span className="ml-2">Active</span>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <h4 className="font-medium">{school.schoolName}</h4>
                      <p className="text-sm text-muted-foreground">{school.schoolEmail}</p>
                      {/* Display the masked password */}
                      <p className="text-sm text-muted-foreground">Password: ********</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {school.isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveChanges(school.id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleEdit(school.id)}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSchool(school.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button onClick={() => setIsAddingNewSchool(!isAddingNewSchool)}>
              {isAddingNewSchool ? "Cancel" : "Add New School"}
            </Button>
          </div>
          {isAddingNewSchool && (
            <div className="mt-4 space-y-2">
              <Input
                value={newSchool.schoolId}
                onChange={(e) => setNewSchool({ ...newSchool, schoolId: e.target.value })}
                placeholder="School ID"
              />
              <Input
                value={newSchool.schoolName}
                onChange={(e) => setNewSchool({ ...newSchool, schoolName: e.target.value })}
                placeholder="School Name"
              />
              <Input
                value={newSchool.schoolEmail}
                onChange={(e) => setNewSchool({ ...newSchool, schoolEmail: e.target.value })}
                placeholder="School Email"
              />
              <Input
                type="password" // Use password type for security
                value={newSchool.schoolPassword}
                onChange={(e) => setNewSchool({ ...newSchool, schoolPassword: e.target.value })}
                placeholder="School Password"
              />
              <Input
                value={newSchool.schoolLogo}
                onChange={(e) => setNewSchool({ ...newSchool, schoolLogo: e.target.value })}
                placeholder="Logo URL"
              />
              <Input
                value={newSchool.schoolAddress}
                onChange={(e) => setNewSchool({ ...newSchool, schoolAddress: e.target.value })}
                placeholder="Address"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newSchool.schoolModuleBoolean}
                  onChange={(e) => setNewSchool({ ...newSchool, schoolModuleBoolean: e.target.checked })}
                />
                <span className="ml-2">Active</span>
              </label>
              <Button onClick={addNewSchool}>Add School</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

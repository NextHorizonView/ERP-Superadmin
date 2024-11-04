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
  schoolId?: string; // Use Firestore's doc ID as schoolId
  schoolName: string;
  schoolEmail: string;
  schoolPassword: string;
  schoolLogo: string;
  schoolAddress: string;
  schoolModuleBoolean: boolean;
  isEditing: boolean;
}

export default function SchoolDashboard() {
  const [schools, setSchools] = useState<School[]>([]);
  const [newSchool, setNewSchool] = useState<School>({
    id: uuidv4(),
    schoolName: "",
    schoolEmail: "",
    schoolPassword: "",
    schoolLogo: "",
    schoolAddress: "",
    schoolModuleBoolean: true,
    isEditing: true,
  });
  const [isAddingNewSchool, setIsAddingNewSchool] = useState(false);

  const schoolsCollection = collection(db, "schools");

  useEffect(() => {
    const fetchSchools = async () => {
      const querySnapshot = await getDocs(schoolsCollection);
      const fetchedSchools: School[] = querySnapshot.docs.map((doc) => ({
        id: uuidv4(),
        firestoreId: doc.id,
        schoolId: doc.id, // Use Firestore's doc ID as schoolId
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

  const handleFileChange = (id: string, file: File | null) => {
    setSchools((prevSchools) =>
      prevSchools.map((school) =>
        school.id === id ? { ...school, schoolLogoFile: file } : school
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
        try {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            school.schoolEmail,
            school.schoolPassword
          );

          const docRef = await addDoc(schoolsCollection, {
            schoolName: school.schoolName,
            schoolEmail: school.schoolEmail,
            authUid: user.uid,
            schoolLogo: school.schoolLogo,
            schoolAddress: school.schoolAddress,
            schoolModuleBoolean: school.schoolModuleBoolean,
          });

          setSchools((prevSchools) =>
            prevSchools.map((s) =>
              s.id === id ? { ...s, firestoreId: docRef.id, schoolId: docRef.id, isEditing: false } : s
            )
          );
        } catch (error) {
          console.error("Error creating school in Auth:", error);
        }
      } else {
        const schoolDoc = doc(db, "schools", school.firestoreId);
        await updateDoc(schoolDoc, {
          schoolName: school.schoolName,
          schoolEmail: school.schoolEmail,
          schoolLogo: school.schoolLogo,
          schoolAddress: school.schoolAddress,
          schoolModuleBoolean: school.schoolModuleBoolean,
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

  const addNewSchool = async () => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        newSchool.schoolEmail,
        newSchool.schoolPassword
      );

      const docRef = await addDoc(schoolsCollection, {
        schoolName: newSchool.schoolName,
        schoolEmail: newSchool.schoolEmail,
        authUid: user.uid,
        schoolLogo: newSchool.schoolLogo,
        schoolAddress: newSchool.schoolAddress,
        schoolModuleBoolean: newSchool.schoolModuleBoolean,
      });

      setSchools((prevSchools) => [
        ...prevSchools,
        {
          id: uuidv4(),
          firestoreId: docRef.id,
          schoolId: docRef.id, // Assign Firestore's doc ID as schoolId
          schoolName: newSchool.schoolName,
          schoolEmail: newSchool.schoolEmail,
          schoolPassword: "",
          schoolLogo: newSchool.schoolLogo,
          schoolAddress: newSchool.schoolAddress,
          schoolModuleBoolean: newSchool.schoolModuleBoolean,
          isEditing: false,
        },
      ]);

      setNewSchool({
        id: uuidv4(),
        schoolName: "",
        schoolEmail: "",
        schoolPassword: "",
        schoolLogo: "",
        schoolAddress: "",
        schoolModuleBoolean: true,
        isEditing: true,
      });
      setIsAddingNewSchool(false);
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
                        type="password"
                        value={school.schoolPassword}
                        onChange={(e) => handleInputChange(school.id, "schoolPassword", e.target.value)}
                        placeholder="School Password"
                      />
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(school.id, e.target.files ? e.target.files[0] : null)}
                        accept="image/*"
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
                      <Edit3 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteSchool(school.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {!isAddingNewSchool && (
            <Button
              variant="outline"
              onClick={() => setIsAddingNewSchool(true)}
              className="mt-4 w-full"
            >
              Add New School
            </Button>
          )}
          {isAddingNewSchool && (
            <div className="space-y-2 mt-4">
              <Input
                value={newSchool.schoolName}
                onChange={(e) => setNewSchool((prev) => ({ ...prev, schoolName: e.target.value }))}
                placeholder="School Name"
              />
              <Input
                value={newSchool.schoolEmail}
                onChange={(e) => setNewSchool((prev) => ({ ...prev, schoolEmail: e.target.value }))}
                placeholder="School Email"
              />
              <Input
                type="password"
                value={newSchool.schoolPassword}
                onChange={(e) => setNewSchool((prev) => ({ ...prev, schoolPassword: e.target.value }))}
                placeholder="School Password"
              />
              <Input
                value={newSchool.schoolLogo}
                onChange={(e) => setNewSchool((prev) => ({ ...prev, schoolLogo: e.target.value }))}
                placeholder="Logo URL"
              />
              <Input
                value={newSchool.schoolAddress}
                onChange={(e) => setNewSchool((prev) => ({ ...prev, schoolAddress: e.target.value }))}
                placeholder="Address"
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newSchool.schoolModuleBoolean}
                  onChange={(e) => setNewSchool((prev) => ({ ...prev, schoolModuleBoolean: e.target.checked }))}
                />
                <span className="ml-2">Active</span>
              </label>
              <Button
                variant="default"
                onClick={addNewSchool}
                className="mt-2 w-full"
              >
                Save New School
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddingNewSchool(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

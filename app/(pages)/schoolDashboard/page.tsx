

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import {Trash2, Edit3 } from "lucide-react";
// import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface School {
  id: string;
  firestoreId?: string;
  schoolId: string;
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
    schoolId: "",
    schoolName: "",
    schoolEmail: "",
    schoolPassword: "",
    schoolLogo: "",
    schoolAddress: "",
    schoolModuleBoolean: true, // Default to active
    isEditing: true,
  });

  const schoolsCollection = collection(db, "schools");

  // Fetch schools from Firestore
  useEffect(() => {
    const fetchSchools = async () => {
      const querySnapshot = await getDocs(schoolsCollection);
      const fetchedSchools: School[] = querySnapshot.docs.map((doc) => ({
        id: uuidv4(),
        firestoreId: doc.id,
        schoolId: doc.data().schoolId || "",
        schoolName: doc.data().schoolName || "",
        schoolEmail: doc.data().schoolEmail || "",
        schoolPassword: doc.data().schoolPassword || "",
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
        // Add new school to Firestore
        const docRef = await addDoc(schoolsCollection, {
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          schoolEmail: school.schoolEmail,
          schoolPassword: school.schoolPassword,
          schoolLogo: school.schoolLogo,
          schoolAddress: school.schoolAddress,
          schoolModuleBoolean: school.schoolModuleBoolean,
        });
        setSchools((prevSchools) =>
          prevSchools.map((s) =>
            s.id === id ? { ...s, firestoreId: docRef.id, isEditing: false } : s
          )
        );
      } else {
        // Update existing school in Firestore
        const schoolDoc = doc(db, "schools", school.firestoreId);
        await updateDoc(schoolDoc, {
          schoolId: school.schoolId,
          schoolName: school.schoolName,
          schoolEmail: school.schoolEmail,
          schoolPassword: school.schoolPassword,
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
      await deleteDoc(schoolDoc); // Delete from Firestore
    }
    setSchools(schools.filter((school) => school.id !== id));
  };

  const addNewSchool = () => {
    setSchools((prevSchools) => [...prevSchools, { ...newSchool }]);
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
                        value={school.schoolPassword}
                        onChange={(e) => handleInputChange(school.id, "schoolPassword", e.target.value)}
                        placeholder="School Password"
                        type="password"
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
        </CardContent>
      </Card>
      <Button className="mt-4" onClick={addNewSchool}>Add New School</Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2, Lock, Mail, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddSchoolForm from "@/components/forms/AddSchoolForm";
import EditSchoolForm from "@/components/forms/EditSchoolForm";

export default function Dashboard() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "School 1",
      email: "school1@example.com",
      logo: "https://via.placeholder.com/50",
      address: "Address 1",
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [error, setError] = useState<string | null>(null); // State for error messages

  const addItem = (newItem: any) => {
    // Validate input
    if (!newItem.name || !newItem.email || !newItem.address) {
      setError("All fields are required.");
      return;
    }

    setItems([...items, { ...newItem, id: Date.now() }]);
    setShowAddForm(false);
    setError(null); // Clear any previous error
  };

  const saveEditedItem = (updatedSchool: any) => {
    // Validate input
    if (!updatedSchool.name || !updatedSchool.email || !updatedSchool.address) {
      setError("All fields are required.");
      return;
    }

    setItems(
      items.map((item) => (item.id === updatedSchool.id ? updatedSchool : item))
    );
    setEditingSchool(null);
    setError(null); // Clear any previous error
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex justify-center p-6 min-h-screen">
      <Card className="w-full max-w-4xl shadow-lg rounded-lg ">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold mb-4">
            Dashboard
          </CardTitle>
          <CardDescription className="text-gray-600 mb-6">
            Manage Your Schools
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="text-red-500 text-center">{error}</div>}{" "}
          {/* Display error message */}
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              <Plus className="mr-2 h-5 w-5" /> Add New School
            </Button>
          </div>
          {showAddForm && <AddSchoolForm onSave={addItem} />}
          {editingSchool && (
            <EditSchoolForm
              school={editingSchool}
              onSave={saveEditedItem}
              onCancel={() => setEditingSchool(null)}
            />
          )}
          <div className="bg-gray-100 p-4 rounded-md shadow-md">
            <h3 className="font-bold text-lg mb-4">Schools:</h3>
            {items.length > 0 ? (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="bg-white p-4 rounded-md shadow-sm flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      {item.logo && (
                        <img
                          src={item.logo}
                          alt={`${item.name} logo`}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      )}
                      <div>
                        <h4 className="font-semibold text-xl">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.email}</p>
                        <p className="text-sm text-gray-500">{item.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSchool(item)} // Set the school to be edited
                        className="hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          console.log(`Reset password for ${item.name}`)
                        }
                        className="hover:text-blue-600"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Reset Password
                      </Button>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log(`Edit email for ${item.name}`)}
                        className="hover:text-blue-600"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Edit Email
                      </Button> */}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No schools to display</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Trash2, Lock, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [items, setItems] = useState([
    { id: 1, name: "School 1" },
    { id: 2, name: "School 2" },
    { id: 3, name: "School 3" },
  ]);
  const [newItemName, setNewItemName] = useState("");

  const addItem = () => {
    if (newItemName.trim() !== "") {
      const newItem = {
        id: Date.now(),
        name: newItemName.trim(),
      };
      setItems([...items, newItem]);
      setNewItemName("");
    }
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleResetPassword = (id: number) => {
    console.log(`Reset password clicked for school ${id}`);
  };

  const handleEditEmail = (id: number) => {
    console.log(`Edit email clicked for school ${id}`);
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Dashboard</CardTitle>
          <CardDescription> your Schools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="New school name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="flex-grow"
              />
              <Button onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-semibold mb-2">Schools:</h3>
              {items.length > 0 ? (
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="bg-card p-2 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                    >
                      <span className="font-medium">{item.name}</span>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResetPassword(item.id)}
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          Reset Password
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEmail(item.id)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Edit Email
                        </Button>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit3, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SuperAdminPage() {
  const [admins, setAdmins] = useState([
    { id: 1, name: "Admin 1", email: "admin1@example.com", isEditing: false },
    { id: 2, name: "Admin 2", email: "admin2@example.com", isEditing: false },
  ]);

  const toggleEdit = (id: number) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === id ? { ...admin, isEditing: !admin.isEditing } : admin
      )
    );
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === id ? { ...admin, [field]: value } : admin
      )
    );
  };

  const saveChanges = (id: number) => {
    setAdmins((prevAdmins) =>
      prevAdmins.map((admin) =>
        admin.id === id ? { ...admin, isEditing: false } : admin
      )
    );
    console.log(`Changes saved for admin with ID: ${id}`);
  };

  const resetEmail = (id: number) => {
    console.log(`Reset email requested for admin with ID: ${id}`);
  };

  const deleteAdmin = (id: number) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  return (
    <div className="w-full flex justify-center p-2 sm:p-4 min-h-screen">
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
                        value={admin.name}
                        onChange={(e) =>
                          handleInputChange(admin.id, "name", e.target.value)
                        }
                        placeholder="Admin Name"
                      />
                      <Input
                        value={admin.email}
                        onChange={(e) =>
                          handleInputChange(admin.id, "email", e.target.value)
                        }
                        placeholder="Admin Email"
                      />
                    </div>
                  ) : (
                    <Link
                      href={`/superadmin/admin/${admin.id}`}
                      className="block hover:underline"
                    >
                      <h4 className="font-medium">{admin.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {admin.email}
                      </p>
                    </Link>
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
                    variant="outline"
                    size="sm"
                    onClick={() => resetEmail(admin.id)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Reset Email
                  </Button>
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
        </CardContent>
      </Card>
    </div>
  );
}

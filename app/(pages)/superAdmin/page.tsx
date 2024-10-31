// SuperAdminPage.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit3, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";

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
        <div className="w-full flex justify-center p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Super Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {admins.map((admin) => (
                            <li key={admin.id} className="bg-card p-4 rounded flex justify-between items-center">
                                <div>
                                    {admin.isEditing ? (
                                        <div>
                                            <Input
                                                value={admin.name}
                                                onChange={(e) => handleInputChange(admin.id, "name", e.target.value)}
                                                placeholder="Admin Name"
                                                className="mb-2"
                                            />
                                            <Input
                                                value={admin.email}
                                                onChange={(e) => handleInputChange(admin.id, "email", e.target.value)}
                                                placeholder="Admin Email"
                                            />
                                        </div>
                                    ) : (
                                        <div>
                                            <h4 className="font-medium">{admin.name}</h4>
                                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {admin.isEditing ? (
                                        <Button variant="outline" size="sm" onClick={() => saveChanges(admin.id)}>
                                            Save
                                        </Button>
                                    ) : (
                                        <Button variant="outline" size="sm" onClick={() => toggleEdit(admin.id)}>
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    )}
                                    <Button variant="outline" size="sm" onClick={() => resetEmail(admin.id)}>
                                        <Mail className="w-4 h-4 mr-2" />
                                        Reset Email
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => deleteAdmin(admin.id)}>
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

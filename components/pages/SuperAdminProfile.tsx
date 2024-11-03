"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function SuperAdminProfile() {
  const [superAdmin, setSuperAdmin] = useState({
    id: 1,
    name: "Super Admin",
    email: "superadmin@example.com",
    profileImage: "",
  });

  useEffect(() => {
    // Fetch or set initial state if needed
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setSuperAdmin((prevAdmin) => ({
      ...prevAdmin,
      [field]: value,
    }));
  };

  const resetEmail = () => {
    console.log(`Reset email requested for Super Admin`);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSuperAdmin((prevAdmin) => ({
          ...prevAdmin,
          profileImage: reader.result as string,
        }));
      };
      reader.onerror = () => {
        console.error("Failed to read the file!");
      };
      reader.readAsDataURL(file);
    } else {
      console.warn("No file selected for upload.");
    }
  };

  return (
    <div className="w-full flex justify-center p-2 sm:p-4 min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center">
            Super Admin Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <Avatar className="w-24 h-24">
              {superAdmin.profileImage ? (
                <AvatarImage
                  src={superAdmin.profileImage}
                  alt="Profile Image"
                />
              ) : (
                <AvatarFallback>{superAdmin.name[0]}</AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="text-center">
            <label className="text-sm font-medium text-muted-foreground">
              Change Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-xs p-1 mt-2"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <Input
              value={superAdmin.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <Input
              value={superAdmin.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Email"
            />
          </div>
          <Button
            className="w-full mt-4"
            variant="outline"
            onClick={resetEmail}
          >
            <Mail className="w-4 h-4 mr-2" />
            Reset Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

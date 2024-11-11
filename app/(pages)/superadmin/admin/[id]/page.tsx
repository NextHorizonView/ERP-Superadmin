"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Edit3 } from "lucide-react";
import Link from "next/link";

interface Admin {
  id: number;
  name: string;
  email: string;
}

export default function AdminDetailsPage() {
  const params = useParams();
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    if (!params?.id) {
      return; // Return early if there's no id parameter
    }
    
    const mockAdmins = [
      { id: 1, name: "Admin 1", email: "admin1@example.com" },
      { id: 2, name: "Admin 2", email: "admin2@example.com" },
    ];
    
    const foundAdmin = mockAdmins.find((a) => a.id === Number(params.id));
    setAdmin(foundAdmin || null);
  }, [params?.id]); // Add optional chaining here too to prevent errors

  if (!admin) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex justify-center p-2 sm:p-4 min-h-screen">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Link
            href="/superAdmin"
            className="flex items-center text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Super Admin Dashboard
          </Link>
          <CardTitle className="text-xl sm:text-2xl font-bold">
            Admin Details: {admin.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Name</h3>
              <p>{admin.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Email</h3>
              <p>{admin.email}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-4">
              <Button variant="outline" size="sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Admin
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Reset Email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

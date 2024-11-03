"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SchoolData {
  name: string;
  email: string;
  logo: string; // This will now store the image URL after upload
  address: string;
}

export default function AddSchoolForm({
  onSave,
}: {
  onSave: (schoolData: Omit<SchoolData, "id">) => void;
}) {
  const [formData, setFormData] = useState<Omit<SchoolData, "id">>({
    name: "",
    email: "",
    logo: "",
    address: "",
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result as string }));
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Pass the formData without id
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        type="text"
        placeholder="School Name"
        value={formData.name}
        onChange={handleChange}
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <Input
        name="logo"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      {file && (
        <div className="mt-2">
          <img
            src={URL.createObjectURL(file)}
            alt="Logo Preview"
            className="w-20 h-20 object-cover rounded"
          />
        </div>
      )}
      <Input
        name="address"
        type="text"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />
      <Button type="submit">Save School</Button>
    </form>
  );
}

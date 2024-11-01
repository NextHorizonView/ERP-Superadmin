"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SchoolData {
  name: string;
  email: string;
  logo: string;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        type="text"
        placeholder="Logo URL"
        value={formData.logo}
        onChange={handleChange}
      />
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

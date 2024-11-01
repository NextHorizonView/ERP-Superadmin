import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface School {
  id: number;
  name: string;
  email: string;
  logo: string;
  address: string;
}

export default function EditSchoolForm({
  school,
  onSave,
  onCancel,
}: {
  school: School;
  onSave: (schoolData: School) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(school.name);
  const [email, setEmail] = useState(school.email);
  const [logo, setLogo] = useState(school.logo);
  const [address, setAddress] = useState(school.address);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string); // Set logo to the data URL
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = () => {
    onSave({
      ...school,
      name,
      email,
      logo,
      address,
    });
  };

  return (
    <div className="space-y-4">
      <Input
        name="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="School Name"
      />
      <Input
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Address"
      />
      <div className="flex gap-2">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

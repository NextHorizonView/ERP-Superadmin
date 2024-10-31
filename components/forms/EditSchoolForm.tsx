// EditSchoolForm.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditSchoolForm({ school, onSave, onCancel }: any) {
  const [name, setName] = useState(school.name);
  const [email, setEmail] = useState(school.email);
  const [logo, setLogo] = useState(school.logo);
  const [address, setAddress] = useState(school.address);

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
    <div className="bg-muted p-4 rounded-md space-y-4">
      <Input
        type="text"
        placeholder="School Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        placeholder="School Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="text"
        placeholder="School Logo URL"
        value={logo}
        onChange={(e) => setLogo(e.target.value)}
      />
      <Input
        type="text"
        placeholder="School Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div className="flex space-x-2">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

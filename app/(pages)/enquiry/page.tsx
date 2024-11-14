"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function EnquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulating an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Enquiry Submitted",
      description: "We've received your enquiry and will get back to you soon.",
    });

    setIsSubmitting(false);
    event.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required />
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Enquiry"}
      </Button>
    </form>
  );
}

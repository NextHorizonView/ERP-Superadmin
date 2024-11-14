"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig.js"; // Import Firebase auth
import Image from "next/image";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Use Firebase's signInWithEmailAndPassword
      await signInWithEmailAndPassword(auth, email, password);

      toast({ title: "Login successful!" });

      // Redirect to homepage after successful login

      router.push("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          title: "Login failed",
          description: error.message || "Please check your credentials.",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials.",
        });
      }
    }
  };
  return (
    <div className="flex h-screen mx-auto w-full items-center justify-center bg-slate-400">
      <div className="flex-[1] bg-pink-600 h-full relative">
        <Image
          src="/login.jpg"
          alt="login image"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-[2] bg-red-300 h-full flex items-center justify-center">
        <Card className="w-full h-full px-20">
          <CardHeader>
            <div className="text-left">
              <Image
                src="/cast_for_education.jpg"
                alt="Logo"
                width={50}
                height={50}
                className=""
              />
              <h2 className="mt-6 text-3xl font-bold">Login Account</h2>
              <p className="mt-2 text-sm text-gray-600">
                For Admin, Teacher or Student
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="my-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-3/5 my-2"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="my-2">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-3/5 my-2"
                  />
                </div>
              </div>

              <div className="text-sm ">
                <Link href="/#" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <div className="flex text-left items-center ">
                <Input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 space-x-4 "
                />
                <Label htmlFor="remember-me" className="text-sm space-x-4 ml-4">
                  Remember me
                </Label>
              </div>
              <div className="flex text-left items-center">
                <Input
                  id="Privacypolicy"
                  type="checkbox"
                  className="w-4 space-x-4"
                />
                <Label
                  htmlFor="Privacypolicy"
                  className="text-sm space-x-4 ml-4"
                >
                  I agree to all the Terms and Privacy policy
                </Label>
              </div>
              <div className="flex justify-between min-w-fit">
                <Button
                  type="submit"
                  className="w-full bg-orange-300 hover:bg-orange-400 m-5"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Login"}
                </Button>

                <Button variant="outline" className="w-full m-5">
                  <Image
                    src="/googlepng.png"
                    alt="Google logo"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Sign in with Google
                </Button>
              </div>
            </form>

            <div className="mt-6 flex justify-center space-x-4">
              <Image
                src="/Layer2.png"
                alt="Get it on Google Play"
                width={140}
                height={40}
                className="hover:scale-105 transition-all duration-100"
              />
              <Image
                src="/App-Store-Badge.png"
                alt="Download on the App Store"
                width={140}
                height={40}
                className="hover:scale-105 transition-all duration-100"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

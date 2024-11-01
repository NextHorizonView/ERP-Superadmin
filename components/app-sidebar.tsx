"use client";

import { Calendar, Home, Inbox, Search, Settings, LogOut } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "next/navigation";

const authItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "School Dashboard",
    url: "/schoolDashboard",
    icon: Settings,
  },
  {
    title: "Superadmin Dashboard",
    url: "/superadmin",
    icon: Settings,
  },
];

const unauthItems = [
  {
    title: "Login",
    url: "/login",
    icon: Search,
  },
  {
    title: "Signup",
    url: "/signup",
    icon: Settings,
  },
];

export function AppSidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsAuthenticated(false);
    router.push("/login");
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>LOGO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Render menu items based on authentication status */}
              {(isAuthenticated ? authItems : unauthItems).map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isAuthenticated && (
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={handleLogout}>
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

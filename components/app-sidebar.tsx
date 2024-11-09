"use client";

import { Home, Search, Settings, LogOut } from "lucide-react";
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
import Loader from "@/components/ui/Loader";

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
    url: "/superAdmin",
    icon: Settings,
  },
];

const unauthItems = [
  {
    title: "LoginSuperAdmin",
    url: "/login",
    icon: Search,
  },
];

export function AppSidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    setLoading(true); // Start loading
    await signOut(auth);
    setIsAuthenticated(false);
    router.push("/login");
    setLoading(false); // Stop loading
  };

  const handleNavigation = (url: string) => {
    setLoading(true); // Start loading on navigation
    router.push(url);
    setLoading(false); // Stop loading after navigation
  };

  return (
    <>
      {loading && <Loader />} {/* Show loader while loading */}
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>LOGO</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(isAuthenticated ? authItems : unauthItems).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url} onClick={() => handleNavigation(item.url)}>
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
    </>
  );
}

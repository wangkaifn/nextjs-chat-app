"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useUser } from "@/contexts/UserContext";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  console.log(user);

  if (!user) {
    // redirect('/login');
  }
  // useEffect(() => {
  //   if (!user) {
  //     redirect('/login');
  //   }
  // }, []);
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex flex-col flex-1">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}

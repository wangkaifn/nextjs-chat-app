"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { redirect } from "next/navigation";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuth();
  if (!loading && !isAuthenticated) {
    redirect("/login");
  }

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

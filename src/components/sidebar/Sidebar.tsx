"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useConversations } from "./hooks/useConversation";
import { ConversationList } from "./ConversationList";
import { NavUser } from "../nav-user";
import { ConversationForm } from "./ConversationForm";
import { SidebarHeader as CustomSidebarHeader } from "./SidebarHeader";
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout, setSelectedGptModule, selectedGptModule } = useAuth();
  const router = useRouter();
  const { id } = useParams();

  const {
    conversations,
    loading,
    activeConversationId,
    setActiveConversationId,
    handleNewConversation,
    handleEditConversation,
    handleDeleteConversation,
    openForm,
    setOpenForm,
    formType,
    currentConversation,
    setConversations,
  } = useConversations(user?.id, id as string);

  // 初始化时如果没有会话，跳转到聊天首页
  useEffect(() => {
    if (conversations.length === 0 && !loading) {
      router.push("/chat");
    }
  }, [conversations, loading, router]);

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <CustomSidebarHeader
            selectedGptModule={selectedGptModule}
            setSelectedGptModule={setSelectedGptModule}
            onNewConversation={handleNewConversation}
          />
        </SidebarHeader>
        <SidebarContent>
          <ConversationList
            conversations={conversations}
            loading={loading}
            activeConversationId={activeConversationId}
            onConversationSelect={setActiveConversationId}
            onEdit={handleEditConversation}
            onDelete={handleDeleteConversation}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: user?.username || "",
              email: user?.email || "",
              avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
            }}
            logout={logout}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <ConversationForm
        open={openForm}
        setOpen={setOpenForm}
        currentConversation={currentConversation}
        setIsActiveConversation={setActiveConversationId}
        formType={formType}
        userId={user?.id as string}
        setConversationList={setConversations}
      />
    </>
  );
}

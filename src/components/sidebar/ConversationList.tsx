"use client";

import { Conversation } from "@/services/conversationService";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ConversationMenu } from "./ConversationMenu";
import { SkeletonSidebarLoading } from "../skeleton-sidebar-loading";
import { useRouter } from "next/navigation";

interface ConversationListProps {
  conversations: Conversation[];
  isLoading: boolean;
  activeConversationId: string;
  isMobile: boolean;
  onConversationSelect: (id: string) => void;
  onEdit: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  isLoading,
  activeConversationId,
  isMobile,
  onConversationSelect,
  onEdit,
  onDelete,
}: ConversationListProps) {
  const router = useRouter();

  if (isLoading) {
    return <SkeletonSidebarLoading />;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>会话列表</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {conversations?.map((conversation) => (
            <SidebarMenuItem key={conversation.id}>
              <SidebarMenuButton
                asChild
                onClick={() => {
                  onConversationSelect(conversation.id);
                  router.push(`/chat/${conversation.id}`);
                }}
                isActive={activeConversationId === conversation.id}
              >
                <a>{conversation.title}</a>
              </SidebarMenuButton>
              <ConversationMenu
                isMobile={isMobile}
                onEdit={() => onEdit(conversation)}
                onDelete={() => onDelete(conversation.id)}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

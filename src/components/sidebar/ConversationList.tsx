"use client";

import { Conversation } from "@/services/conversationService";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SkeletonSidebarLoading } from "@/components/skeleton-sidebar-loading";
import { ConversationMenuItem } from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  onEdit: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
}

export function ConversationList({
  conversations,
  loading,
  activeConversationId,
  onConversationSelect,
  onEdit,
  onDelete,
}: ConversationListProps) {
  if (loading) {
    return <SkeletonSidebarLoading />;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>会话列表</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {conversations.map((conversation) => (
            <ConversationMenuItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversationId === conversation.id}
              onSelect={onConversationSelect}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

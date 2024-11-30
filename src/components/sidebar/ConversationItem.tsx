"use client";

import { Conversation } from "@/services/conversationService";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { ConversationMenu } from "./ConversationMenu";
import Link from "next/link";

interface ConversationMenuItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEdit: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
}

export function ConversationMenuItem({
  conversation,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: ConversationMenuItemProps) {
  const handleSelect = () => {
    onSelect(conversation.id);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild onClick={handleSelect} isActive={isActive}>
        <Link href={`/chat/${conversation.id}`}>{conversation.title}</Link>
      </SidebarMenuButton>
      <ConversationMenu
        onEdit={() => onEdit(conversation)}
        onDelete={() => onDelete(conversation.id)}
      />
    </SidebarMenuItem>
  );
}

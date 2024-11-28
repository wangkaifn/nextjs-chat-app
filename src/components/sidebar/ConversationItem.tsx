"use client";

import { Conversation } from "@/services/conversationService";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
} from "@/components/ui/sidebar";
import { ConversationMenu } from "./ConversationMenu";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleSelect = () => {
    onSelect(conversation.id);
    router.push(`/chat/${conversation.id}`);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild onClick={handleSelect} isActive={isActive}>
        <a>{conversation.title}</a>
      </SidebarMenuButton>
      <ConversationMenu
        onEdit={() => onEdit(conversation)}
        onDelete={() => onDelete(conversation.id)}
      />
    </SidebarMenuItem>
  );
}

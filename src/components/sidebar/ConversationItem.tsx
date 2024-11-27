import { DropdownMenu } from "../ui/dropdown-menu";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import { ConversationMenu } from "./ConversationMenu";
import { ConversationItemProps } from "./types/conversation";

export function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onEdit,
  onDelete,
}: ConversationItemProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        onClick={() => onSelect(conversation.id)}
        isActive={isActive}
      >
        <a>{conversation.title}</a>
      </SidebarMenuButton>
      <ConversationMenu
        isMobile={isMobile}
        onEdit={() => onEdit(conversation)}
        onDelete={() => onDelete(conversation.id)}
      />
    </SidebarMenuItem>
  );
}

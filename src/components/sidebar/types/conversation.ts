export interface Conversation {
  id: string;
  title: string;
  // ... 其他属性
}

export type FormType = "add" | "edit";

export interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEdit: (conversation: Conversation) => void;
  onDelete: (id: string) => void;
}

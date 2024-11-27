import { useState, useEffect, useCallback } from "react";
import * as conversationService from "@/services/conversationService";
import type { Conversation } from "@/services/conversationService";
import { FormType } from "../types/conversation";
import { useToast } from "@/hooks/use-toast";
/**
 * 会话管理Hook
 * 处理会话列表的状态管理和操作
 */
export function useConversations(userId?: string, initialActiveId?: string) {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(
    initialActiveId || ""
  );
  const [openForm, setOpenForm] = useState(false);
  const [formType, setFormType] = useState<FormType>();
  const [currentConversation, setCurrentConversation] =
    useState<Conversation>();

  /**
   * 获取会话列表
   */
  const fetchConversations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data } = await conversationService.getConversationList(userId);
      setConversations(data);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  /**
   * 处理新建会话
   */
  const handleNewConversation = useCallback(() => {
    setFormType("add");
    setCurrentConversation(undefined);
    setOpenForm(true);
  }, []);

  /**
   * 处理编辑会话
   */
  const handleEditConversation = useCallback((conversation: Conversation) => {
    setFormType("edit");
    setCurrentConversation(conversation);
    setOpenForm(true);
  }, []);

  /**
   * 处理删除会话
   */
  const handleDeleteConversation = useCallback(
    async (conversationId: string) => {
      try {
        await conversationService.deleteConversation(conversationId);
        toast({
          title: "删除成功",
          description: "删除成功",
          duration: 3000,
        });
        fetchConversations();
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        toast({
          variant: "destructive",
          title: "删除失败",
          description: "请稍后重试",
          duration: 3000,
        });
      }
    },
    [fetchConversations, toast]
  );

  return {
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
    refreshConversations: fetchConversations,
  };
}

import apiClient, { ApiResponse } from '@/lib/apiClient';
export type Conversation = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

/**
 *
 */

export const getConversationList = async (
  userId: string
): Promise<ApiResponse<Conversation[]>> => {
  const conversationList = await apiClient.get<Conversation[]>(
    `/conversations/${userId}`
  );
  return conversationList.data;
};

type CreateConversationDto = {
  title: string;
  isPinned: boolean;
  userId: string;
};
// 创建会话
export const createConversation = async (
  data: CreateConversationDto
): Promise<ApiResponse<Conversation>> => {
  const conversation = await apiClient.post<Conversation>(
    '/conversations',
    data
  );
  return conversation.data;
};

// 删除会话
export const deleteConversation = async (
  id: string
): Promise<ApiResponse<boolean>> => {
  const conversation = await apiClient.delete<boolean>(`/conversations/${id}`);
  return conversation.data;
};

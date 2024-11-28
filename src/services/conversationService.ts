import { ApiResponse } from "@/lib/api/types";
import apiClient from "@/lib/apiClient";
export type Conversation = {
  id: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
};

/**
 *
 */

export const getConversationList = async (
  userId: string
): Promise<ApiResponse<Conversation[]>> => {
  const conversationList = await apiClient.get<ApiResponse<Conversation[]>>(
    `/conversations/${userId}`
  );
  return conversationList.data;
};

type CreateConversationDto = {
  title: string;
  isPinned?: boolean;
  userId: string;
};
// 创建会话
export const createConversation = async (
  data: CreateConversationDto
): Promise<ApiResponse<Conversation>> => {
  const conversation = await apiClient.post<Conversation>(
    "/conversations",
    data
  );
  return conversation.data;
};

// 修改会话
export const updateConversation = async (
  data: Conversation
): Promise<ApiResponse<Partial<Conversation>>> => {
  const conversation = await apiClient.put<Partial<Conversation>>(
    `/conversations/${data.id}`,
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

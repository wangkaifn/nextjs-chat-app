import apiClient, { ApiResponse } from "@/lib/apiClient";

export interface Message {
  role: string;
  assistantMessage?: {
    content: string;
  };
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  conversationId: string;
  userId: string;
}

// 获取当前会话 的历史消息
export const getMessageListByConversationId = async (
  conversationId: string
): Promise<ApiResponse<Message[]>> => {
  const messageList = await apiClient.get<ApiResponse<Message[]>>(
    `/messages/history`,
    {
      params: {
        conversationId,
      },
    }
  );
  return messageList.data;
};

// {
//     "userId":"cm3ud606g0000srjht1f4iqr0",
//     "conversationId":"cm3udbo4e000460fnlzqelqj5",
//     "content":"nestjs讲解"
// }

type CreateMessageDto = Omit<
  Message,
  "id" | "createdAt" | "updatedAt" | "role"
>;
// 创建消息
export const createMessage = async (
  data: CreateMessageDto
): Promise<ApiResponse<Message>> => {
  const message = await apiClient.post<Message>("/messages/create", data);
  return message.data;
};

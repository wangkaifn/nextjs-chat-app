"use client";
import { useState, useEffect, useMemo } from "react";
import { ChatMessage, ProChat } from "@ant-design/pro-chat";
import { useTheme } from "antd-style";
import { useUser } from "@/contexts/UserContext";
import {
  createMessage,
  getMessageListByConversationId,
  Message,
} from "@/services/messageService";

export default function ChatGPT({
  conversationId,
}: {
  conversationId: string;
}) {
  const theme = useTheme();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  // const [chats, setChats] = useState<ChatMessage<Record<string, any>>[]>([]);

  // 会话消息列表  new set 缓存
  const [conversationMessageList, setConversationMessageList] = useState<
    Map<string, Message[]>
  >(new Map());

  // 获取当前会话消息列表
  const getConversationMessageList = async (id: string) => {
    setLoading(true);
    try {
      const result = await getMessageListByConversationId(id);
      if (result.success) {
        setConversationMessageList(new Map([[id, result.data]]));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  console.log(conversationMessageList, "conversationMessageList");

  useEffect(() => {
    if (conversationId) {
      getConversationMessageList(conversationId);
    }
  }, [conversationId]);

  const chats = useMemo(() => {
    return conversationMessageList.get(conversationId) || [];
  }, [conversationMessageList, conversationId]);

  return (
    <div
      style={{
        backgroundColor: theme.colorBgLayout,
        height: "100%",
      }}
    >
      <ProChat
        style={{
          height: "100%",
        }}
        loading={loading}
        chats={chats?.map((item) => ({
          ...item,
          role: item.role === "USER" ? "user" : "assistant",
        }))}
        userMeta={{
          avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
          title: user?.nickname || user?.username,
        }}
        helloMessage={"欢迎使用 轻记AI"}
        request={async (messages) => {
          const { data } = await createMessage({
            conversationId: conversationId,
            content: messages[messages.length - 1].content as string,
            userId: user?.id as string,
          });
          console.log(data);

          return new Response(data?.assistantMessage?.content);
        }}
      />
    </div>
  );
}

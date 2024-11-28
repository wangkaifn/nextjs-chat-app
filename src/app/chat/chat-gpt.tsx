"use client";
import { useState, useEffect, useMemo } from "react";
import { ProChat } from "@ant-design/pro-chat";
import { useTheme } from "antd-style";
import { useAuth } from "@/contexts/AuthProvider";
import {
  createMessage,
  deleteMessageByConversationId,
  getMessageListByConversationId,
  Message,
} from "@/services/messageService";
import { User } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { message } from "antd";

export default function ChatGPT({
  conversationId,
}: {
  conversationId: string;
}) {
  const theme = useTheme();
  const { toasts } = useToast();
  const { user, selectedGptModule } = useAuth();
  const [loading, setLoading] = useState(false);
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
  useEffect(() => {
    if (conversationId) {
      getConversationMessageList(conversationId);
    }
  }, [conversationId]);

  const chats = useMemo(() => {
    return conversationMessageList.get(conversationId)?.map((item) => ({
      id: item.id,
      createAt: item.createdAt as unknown as number,
      updateAt: item.updatedAt as unknown as number,
      content: item.content,
      role: item.role === "USER" ? "user" : "assistant",
    }));
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
        chats={chats}
        userMeta={{
          avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
          title: user?.nickname || user?.username,
        }}
        helloMessage={"欢迎使用 轻记AI"}
        inputAreaProps={{
          style: {
            zIndex: 10,
          },
        }}
        onResetMessage={async () => {
          deleteMessageByConversationId(conversationId).then((res) => {
            if (res.success) {
              message.success("清除成功");
            }
          });
        }}
        request={async (messages) => {
          const { data } = await createMessage(
            {
              conversationId: conversationId,
              content: messages[messages.length - 1].content as string,
              userId: user?.id as string,
            },
            selectedGptModule
          );
          return new Response(data?.assistantMessage?.content);
        }}
      />
    </div>
  );
}

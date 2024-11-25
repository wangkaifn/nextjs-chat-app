"use client";

import React from "react";
import { Sparkles, Brain, Zap, BookOpen, MessageSquare } from "lucide-react";
import { createConversation } from "@/services/conversationService";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/navigation";

export const EmptyState = () => {
  const { user } = useAuth();
  const router = useRouter();
  if (!user) return null;
  return (
    <div className="flex-1 flex h-full items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          开始您的AI对话之旅
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Feature
            icon={<Brain className="h-6 w-6" />}
            title="智能理解"
            description="自然语言处理，准确理解您的意图"
          />
          <Feature
            icon={<Sparkles className="h-6 w-6" />}
            title="创意激发"
            description="帮助您突破思维局限，激发创新灵感"
          />
          <Feature
            icon={<Zap className="h-6 w-6" />}
            title="即时响应"
            description="快速精准的回答，提高工作效率"
          />
          <Feature
            icon={<BookOpen className="h-6 w-6" />}
            title="知识探索"
            description="海量知识库支持，助您探索未知"
          />
        </div>

        <button
          onClick={() => {
            createConversation({
              title: "新会话",
              userId: user?.id,
              isPinned: false,
            }).then((res) => {
              if (res.success) {
                router.push(`/chat/${res.data.id}`);
              }
            });
          }}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <MessageSquare className="h-5 w-5 mr-2" />
          开始新对话
        </button>
      </div>
    </div>
  );
};

const Feature = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="text-blue-600 mb-3">{icon}</div>
    <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
);

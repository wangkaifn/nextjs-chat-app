"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import * as conversationService from "@/services/conversationService";
import { Conversation } from "@/services/conversationService";
import { ConversationList } from "./ConversationList";
import { SidebarHeader as CustomSidebarHeader } from "./SidebarHeader";
import { FormType } from "./types/conversation";
import { ConversationForm } from "./ConversationForm";
import { NavUser } from "../nav-user";

/**
 * 应用侧边栏组件
 * 整合了会话列表、用户信息和相关操作功能
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const { user, logout, setSelectedGptModule, selectedGptModule } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();

  // 状态管理
  const [isActiveConversation, setIsActiveConversation] = useState(id || "");
  const [conversationList, setConversationList] = useState<Conversation[]>([]);
  const [conversationListLoading, setConversationListLoading] = useState(false);
  const [currentConversationDetail, setCurrentConversationDetail] =
    useState<Conversation>();
  const [openConversationFrom, setOpenConversationFrom] = useState(false);
  const [formType, setFormType] = useState<FormType>();

  // 初始化加载会话列表
  useEffect(() => {
    console.log("user", user);

    if (user && user.id) {
      getConversationList(user.id);
      setIsActiveConversation(id || "");
    }
  }, [user]);

  /**
   * 获取会话列表数据
   */
  const getConversationList = async (userId: string) => {
    setConversationListLoading(true);
    try {
      const data = await conversationService.getConversationList(userId);
      setConversationList(data.data);
      if (data.data?.length === 0) {
        router.push(`/chat`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setConversationListLoading(false);
    }
  };

  /**
   * 处理新建会话
   */
  const handleNewConversation = () => {
    setFormType("add");
    setOpenConversationFrom(true);
  };

  /**
   * 处理编辑会话
   */
  const handleEdit = (conversation: Conversation) => {
    setFormType("edit");
    setOpenConversationFrom(true);
    setCurrentConversationDetail(conversation);
  };

  /**
   * 处理删除会话
   */
  const handleDelete = async (conversationId: string) => {
    try {
      await conversationService.deleteConversation(conversationId);
      toast({
        variant: "destructive",
        title: "删除成功",
        description: "删除成功",
        duration: 3000,
      });
      if (user) {
        getConversationList(user.id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <CustomSidebarHeader
            selectedGptModule={selectedGptModule}
            setSelectedGptModule={setSelectedGptModule}
            onNewConversation={handleNewConversation}
          />
        </SidebarHeader>
        <SidebarContent>
          <ConversationList
            conversations={conversationList}
            isLoading={conversationListLoading}
            activeConversationId={isActiveConversation as string}
            isMobile={isMobile}
            onConversationSelect={setIsActiveConversation}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: user?.username || "",
              email: user?.email || "",
              avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
            }}
            logout={logout}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <ConversationForm
        open={openConversationFrom}
        setOpen={setOpenConversationFrom}
        setConversationList={setConversationList}
        currentConversationDetail={currentConversationDetail}
        setIsActiveConversation={setIsActiveConversation}
        formType={formType}
        userId={user?.id as string}
      />
    </>
  );
}

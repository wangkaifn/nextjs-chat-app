"use client";

import * as React from "react";

import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { ArrowUp, Edit, MoreHorizontal, PlusIcon, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect, useState } from "react";

import * as conversationService from "@/services/conversationService";
import { Conversation } from "@/services/conversationService";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from "next/navigation";
import {
  ConversationFrom,
  FormType,
} from "@/app/chat/components/conversayion-from";
import { SkeletonSidebarLoading } from "./skeleton-sidebar-loading";

// This is sample data.
const data = {
  versions: ["gpt-4o-mini"],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  // 当前选择会话
  const [isActiveConversation, setIsActiveConversation] = useState(id || "");
  // 会话列表
  const [conversationList, setConversationList] = useState<Conversation[]>([]);
  const [conversationListLoading, setConversationListLoading] = useState(false);
  const [currentConversationDetail, setCurrentConversationDetail] =
    useState<Conversation>();
  const [openConversationFrom, setOpenConversationFrom] = useState(false);
  const [formType, setFormType] = useState<FormType>();

  useEffect(() => {
    if (user && user.id) {
      getConversationList(user.id);
      setIsActiveConversation(id || "");
    }
  }, [user, id]);

  const getConversationList = async (id: string) => {
    setConversationListLoading(true);

    try {
      const data = await conversationService.getConversationList(id);
      setConversationList(data.data);
      if (data.data?.length === 0) {
        router.push(`/chat`);
      }
      setConversationListLoading(false);
    } catch (error) {
      console.error(error);
      setConversationListLoading(false);
    }
  };

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <VersionSwitcher
            versions={data.versions}
            defaultVersion={data.versions[0]}
          />
          <Button
            variant="outline"
            onClick={async () => {
              // if (!user) return;
              // const {} = await conversationService.createConversation({
              //   title: "新会话",
              //   userId: user.id,
              //   isPinned: false,
              // });

              // getConversationList(user.id);
              setFormType("add");
              setOpenConversationFrom(true);
            }}
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            新增会话
          </Button>
          <span className="text-xs text-gray-500">仅保留最近7天的会话信息</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup key="conversationList">
            <SidebarGroupLabel>会话列表</SidebarGroupLabel>
            {conversationListLoading ? (
              <SkeletonSidebarLoading />
            ) : (
              <>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {conversationList?.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          onClick={() => {
                            setIsActiveConversation(item.id);
                            // getConversationMessageList(item.id);
                            router.push(`/chat/${item.id}`);
                          }}
                          isActive={isActiveConversation === item.id}
                        >
                          <a>{item.title}</a>
                        </SidebarMenuButton>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuAction
                              showOnHover
                              className="flex items-center text-xs"
                            >
                              <MoreHorizontal />
                              <span className="sr-only">More</span>
                            </SidebarMenuAction>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-24 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align={isMobile ? "end" : "start"}
                          >
                            <DropdownMenuItem disabled>
                              <ArrowUp className="text-muted-foreground" />
                              <span>置顶</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setFormType("edit");
                                setOpenConversationFrom(true);
                                setCurrentConversationDetail(item);
                              }}
                            >
                              <Edit className="text-muted-foreground" />
                              <span>编辑</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                conversationService
                                  .deleteConversation(item.id)
                                  .then(() => {
                                    toast({
                                      variant: "destructive",
                                      title: "删除成功",
                                      description: "删除成功",
                                      duration: 3000,
                                    });
                                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                                    user && getConversationList(user.id);
                                  });
                              }}
                              draggable
                            >
                              <Trash2 className="text-muted-foreground" />
                              <span>删除</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            )}
          </SidebarGroup>
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
      <ConversationFrom
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

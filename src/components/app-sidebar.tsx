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
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

import * as conversationService from "@/services/conversationService";
import { Conversation } from "@/services/conversationService";
import { useToast } from "@/hooks/use-toast";
import {
  getMessageListByConversationId,
  Message,
} from "@/services/messageService";
import { useRouter } from "next/navigation";
import { ConversationFrom } from "@/app/chat/components/conversayion-from";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  // 当前选择会话
  const [isActiveConversation, setIsActiveConversation] = useState("");
  // 会话列表
  const [conversationList, setConversationList] = useState<Conversation[]>([]);

  const [openConversationFrom, setOpenConversationFrom] = useState(false);
  const [formType, setFormType] = useState<string>("");

  useEffect(() => {
    if (user && user.id) {
      console.log(user.id);

      getConversationList(user.id);
    }
  }, [user]);

  const getConversationList = async (id: string) => {
    const data = await conversationService.getConversationList(id);
    setConversationList(data.data);
    if (data.data?.[0]?.id) {
      router.push(`/chat/${data.data?.[0]?.id}`);
      setIsActiveConversation(data.data?.[0]?.id);
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
              if (!user) return;
              const {} = await conversationService.createConversation({
                title: "新会话",
                userId: user.id,
                isPinned: false,
              });

              getConversationList(user.id);
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
                        <DropdownMenuItem>
                          <ArrowUp className="text-muted-foreground" />
                          <span>置顶</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setFormType("edit");
                            setOpenConversationFrom(true);
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
                                });
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
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={{
              name: user?.username || "",
              email: user?.email || "",
              avatar: "https://ui.shadcn.com/avatars/shadcn.jpg",
            }}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <ConversationFrom
        open={openConversationFrom}
        setOpen={setOpenConversationFrom}
        conversationId={isActiveConversation}
      />
    </>
  );
}

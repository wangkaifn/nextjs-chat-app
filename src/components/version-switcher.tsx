"use client";

import * as React from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getGptModelList, GptModelList } from "@/services/gptService";
import { message } from "antd";

export function VersionSwitcher({
  selectedGptModule,
  setSelectedGptModule,
}: {
  selectedGptModule: string;
  setSelectedGptModule: (value: string) => void;
}) {
  const [gptModuleList, setGptModuleList] = React.useState<GptModelList[]>([]);
  React.useLayoutEffect(() => {
    getGptModelList()
      .then((res) => {
        if (res.data && res.success) {
          setGptModuleList(res.data);
        }
      })
      .catch((err) => {
        message.error(err?.message);
      });
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none line-clamp-1">
                <span className="font-semibold">GPT模型</span>
                <span className="line-clamp-1">{selectedGptModule}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] h-56 overflow-y-auto"
            align="start"
          >
            {gptModuleList.map((gptModule) => (
              <DropdownMenuItem
                key={gptModule.id}
                onSelect={() => {
                  setSelectedGptModule(gptModule.name);
                  localStorage.setItem("defaultGptModule", gptModule.name);
                }}
              >
                {gptModule.name}
                {gptModule.name === selectedGptModule && (
                  <Check className="ml-auto" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

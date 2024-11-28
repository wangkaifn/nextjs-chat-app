"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VersionSwitcher } from "@/components/version-switcher";

/**
 * 侧边栏头部组件的属性接口
 */
interface SidebarHeaderProps {
  /** 当前选中的GPT模块 */
  selectedGptModule: string;
  /** 设置选中GPT模块的回调函数 */
  setSelectedGptModule: (module: string) => void;
  /** 新建会话的回调函数 */
  onNewConversation: () => void;
}

/**
 * 侧边栏头部组件
 * 包含GPT模块选择器和新建会话按钮
 */
export function SidebarHeader({
  selectedGptModule,
  setSelectedGptModule,
  onNewConversation,
}: SidebarHeaderProps) {
  return (
    <div className="space-y-2">
      {/* GPT模块选择器 */}
      <VersionSwitcher
        selectedGptModule={selectedGptModule}
        setSelectedGptModule={setSelectedGptModule}
      />
      {/* 新建会话按钮 */}
      <Button variant="outline" className="w-full" onClick={onNewConversation}>
        <PlusIcon className="w-4 h-4 mr-1" />
        新增会话
      </Button>
      {/* 提示信息 */}
      <span className="text-xs text-gray-500 block">
        仅保留最近7天的会话信息
      </span>
    </div>
  );
}

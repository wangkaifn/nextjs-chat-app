"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Conversation } from "@/services/conversationService";
import * as conversationService from "@/services/conversationService";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { FormType } from "./types/conversation";

/**
 * 表单验证模式
 */
const formSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
});

/**
 * 会话表单组件的属性接口
 */
interface ConversationFormProps {
  /** 对话框是否打开 */
  open: boolean;
  /** 设置对话框开关状态的回调函数 */
  setOpen: (open: boolean) => void;
  /** 更新会话列表的回调函数 */
  setConversationList: React.Dispatch<React.SetStateAction<Conversation[]>>;
  /** 当前编辑的会话详情（编辑模式时使用） */
  currentConversationDetail?: Conversation;
  /** 设置当前激活会话的回调函数 */
  setIsActiveConversation: (id: string) => void;
  /** 表单类型：新增或编辑 */
  formType?: FormType;
  /** 用户ID */
  userId: string;
}

/**
 * 会话表单组件
 * 用于新增或编辑会话信息
 */
export function ConversationForm({
  open,
  setOpen,
  setConversationList,
  currentConversationDetail,
  setIsActiveConversation,
  formType,
  userId,
}: ConversationFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentConversationDetail?.title || "",
    },
  });

  /**
   * 表单提交处理函数
   * 处理新增和编辑两种情况
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (formType === "add") {
        // 创建新会话
        const response = await conversationService.createConversation({
          title: values.title,
          userId,
        });

        const newConversation = response.data;
        setConversationList((prevList) => [...prevList, newConversation]);
        setIsActiveConversation(newConversation.id);
        router.push(`/chat/${newConversation.id}`);

        toast({
          title: "创建成功",
          description: "会话创建成功",
          duration: 3000,
        });
      } else if (formType === "edit" && currentConversationDetail) {
        // 更新现有会话
        await conversationService.updateConversation({
          id: currentConversationDetail?.id as string,
          title: values.title,
          userId,
        });

        const updatedList = await conversationService.getConversationList(
          userId
        );
        setConversationList(updatedList.data);

        toast({
          title: "更新成功",
          description: "会话更新成功",
          duration: 3000,
        });
      }

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "操作失败",
        description: "请稍后重试",
        duration: 3000,
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {formType === "add" ? "新增会话" : "编辑会话"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入会话标题" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                }}
              >
                取消
              </Button>
              <Button type="submit">确定</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

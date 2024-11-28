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

const formSchema = z.object({
  title: z.string().min(1, "标题不能为空"),
});

interface ConversationFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setConversationList: React.Dispatch<React.SetStateAction<Conversation[]>>;
  currentConversation?: Conversation;
  setIsActiveConversation: (id: string) => void;
  formType?: FormType;
  userId: string;
}

export function ConversationForm({
  open,
  setOpen,
  setConversationList,
  currentConversation,
  setIsActiveConversation,
  formType,
  userId,
}: ConversationFormProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentConversation?.title || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (formType === "add") {
        const response = await conversationService.createConversation({
          title: values.title,
          userId,
        });

        const newConversation = response.data;
        setConversationList((prevList) => [newConversation, ...prevList]);
        setIsActiveConversation(newConversation.id);
        router.push(`/chat/${newConversation.id}`);

        toast({
          title: "创建成功",
          description: "会话创建成功",
          duration: 3000,
        });
      } else if (formType === "edit" && currentConversation) {
        await conversationService.updateConversation({
          title: values.title,
          userId,
          id: currentConversation.id,
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

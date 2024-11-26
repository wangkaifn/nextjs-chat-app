"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Conversation,
  createConversation,
  getConversationList,
  updateConversation,
} from "@/services/conversationService";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
export type FormType = "edit" | "add";

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "会话名称不少于2个字符",
    })
    .max(20, {
      message: "会话名称不超过20个字符",
    }),
});
export function ConversationFrom({
  open,
  setOpen,
  formType,
  currentConversationDetail,
  setConversationList,
  userId,
  setIsActiveConversation,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentConversationDetail?: Conversation;
  setConversationList: (conversationList: Conversation[]) => void;
  formType?: FormType;
  userId: string;
  setIsActiveConversation: (conversationId: string) => void;
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: currentConversationDetail?.title,
    },
  });

  useEffect(() => {
    form.setValue("title", currentConversationDetail?.title || "");
  }, [currentConversationDetail]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!currentConversationDetail && !userId) return;
    if (formType === "edit") {
      updateConversation({
        id: currentConversationDetail?.id as string,
        title: values.title,
        userId,
      })
        .then((res) => {
          toast({
            title: "更新成功",
            description: res?.message,
            duration: 3000,
          });
          getConversationList(currentConversationDetail?.userId as string).then(
            (res) => {
              setConversationList(res?.data);
            }
          );
        })
        .catch((err) => {
          toast({
            title: "更新失败",
            description: err?.message,
            variant: "destructive",
            duration: 3000,
          });
        })
        .finally(() => {
          setOpen(false);
        });
    }

    if (formType === "add") {
      createConversation({
        title: values.title,
        userId,
        isPinned: false,
      })
        .then((res) => {
          toast({
            title: "创建成功",
            description: "创建成功",
            duration: 3000,
          });
          getConversationList(userId).then((res) => {
            setConversationList(res?.data);
            setIsActiveConversation(res?.data[0]?.id);
          });
        })
        .catch((err) => {
          toast({
            title: "创建失败",
            description: err.message,
            duration: 3000,
          });
        })
        .finally(() => {
          setOpen(false);
        });
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {formType === "add" ? "新增会话" : "修改会话"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>标题</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

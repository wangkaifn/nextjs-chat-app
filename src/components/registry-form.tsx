"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createUser, getRegisterCaptcha } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { SlideTransition } from "@/components/transitions/SlideTransition";

const formSchema = z.object({
  username: z
    .string()
    .min(6, {
      message: "用户名长度为6-20位",
    })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "用户名只能包含字母、数字",
    })
    .max(20),
  email: z.string().email({
    message: "邮箱格式不正确",
  }),
  password: z
    .string()
    .min(6, {
      message: "密码长度为6-20位",
    })
    .max(20),
  code: z.string().length(6, {
    message: "验证码长度为6位",
  }),
});

export function RegistryForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      code: "",
    },
    mode: "onChange",
  });

  const email = form.watch("email");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { success } = await createUser(values);
    if (success) {
      toast({
        title: "注册成功",
        description: "请登录",
        variant: "default",
      });
      router.push("/login");
    }
  }

  const sendRegisterCaptcha = async () => {
    if (!email) {
      toast({
        title: "邮箱不能为空",
        description: "请输入邮箱地址",
      });
      return;
    }

    setCountdown(60);
    setIsDisabled(true);

    const intervalId = setInterval(() => {
      setCountdown((prevCountdown: number) => {
        if (prevCountdown > 0) {
          return prevCountdown - 1;
        } else {
          clearInterval(intervalId);
          setIsDisabled(false);
          return 0;
        }
      });
    }, 1000);

    const result = await getRegisterCaptcha(email);

    if (result) {
      toast({
        title: "发送成功",
        description: "验证码已发送至您的邮箱，请查收",
      });
    }
  };

  return (
    <SlideTransition in={isVisible} duration={600}>
      <Card className="mx-auto min-w-96 md:min-w-[480px] backdrop-blur-lg">
        <CardHeader className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          <CardTitle className="text-2xl">轻记AI GPT Chat</CardTitle>
          <CardDescription>在下面输入您的信息注册账号</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <Input id="username" type="text" required {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>密码</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                          <Button
                            type="button"
                            onClick={sendRegisterCaptcha}
                            disabled={!Boolean(email) || isDisabled}
                          >
                            {countdown > 0
                              ? `${countdown}秒后重新发送`
                              : "发送验证码"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="code"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱验证码</FormLabel>
                      <FormControl>
                        <Input
                          id="code"
                          type="text"
                          placeholder="邮箱验证码"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  注册
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            已有账户？{" "}
            <Link href="/login" className="underline">
              登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </SlideTransition>
  );
}

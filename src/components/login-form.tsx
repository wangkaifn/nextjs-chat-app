"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
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
  password: z
    .string()
    .min(6, {
      message: "密码长度为6-20位",
    })
    .max(20),
});

export function LoginForm() {
  const { toast } = useToast();
  const { login } = useAuth();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await login(values);
  }

  return (
    <SlideTransition in={isVisible} duration={600}>
      <Card className="mx-auto min-w-96 md:min-w-[480px] backdrop-blur-lg">
        <CardHeader className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          <CardTitle className="text-2xl">轻记AI GPT Chat</CardTitle>
          <CardDescription>在下面输入您的用户名以登录您的帐户</CardDescription>
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

                <Button type="submit" className="w-full">
                  登陆
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            没有账户？{" "}
            <Link href="/registry" className="underline">
              注册
            </Link>
          </div>
        </CardContent>
      </Card>
    </SlideTransition>
  );
}

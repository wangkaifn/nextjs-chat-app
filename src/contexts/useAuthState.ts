"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import * as userService from "@/services/userService";
import { AUTH_STORAGE_KEYS } from "./constants";
import { AuthStateType } from "./type";

/**
 * 认证状态管理Hook
 * 处理登录、登出及认证状态维护
 */
export function useAuthState() {
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 认证状态
  const [authState, setAuthState] = useState<AuthStateType>({
    isAuthenticated: false,
    user: null,
  });

  // GPT模块选择状态
  const [selectedGptModule, setSelectedGptModule] = useState("gpt-4o-mini");

  const router = useRouter();
  const { toast } = useToast();

  /**
   * 初始化认证状态
   * 从localStorage读取认证信息
   */
  useEffect(() => {
    try {
      const accessToken = localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      const refreshToken = localStorage.getItem(
        AUTH_STORAGE_KEYS.REFRESH_TOKEN
      );
      const user = localStorage.getItem(AUTH_STORAGE_KEYS.USER);
      const defaultGptModule =
        localStorage.getItem(AUTH_STORAGE_KEYS.DEFAULT_GPT_MODULE) ||
        "gpt-4o-mini";

      if (accessToken && refreshToken) {
        setAuthState({
          isAuthenticated: true,
          user: user ? JSON.parse(user) : null,
        });
      }
      setSelectedGptModule(defaultGptModule);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 登录方法
   * @param username 用户名
   * @param password 密码
   */
  const login = async ({ username, password }: userService.LoginDto) => {
    const response = await userService.login({ username, password });
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      userInfo,
    } = response.data || {};

    if (response?.success) {
      // 登录成功提示
      toast({
        title: "登录成功",
        description: response?.message,
        duration: 3000,
      });

      // 保存认证信息到localStorage
      localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(userInfo));

      // 更新认证状态
      setAuthState({
        isAuthenticated: true,
        user: userInfo,
      });

      // 跳转到聊天页面
      router.push("/chat");
    }
  };

  /**
   * 登出方法
   * 清除认证信息并跳转到登录页
   */
  const logout = () => {
    try {
      // 清除localStorage中的认证信息
      localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

      // 重置认证状态
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    } finally {
      // 如果不在登录页面，则跳转到登录页
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  };

  return {
    authState,
    loading,
    selectedGptModule,
    setSelectedGptModule,
    login,
    logout,
  };
}

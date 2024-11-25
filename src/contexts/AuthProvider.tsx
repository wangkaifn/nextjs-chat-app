"use client";

import { LoginDto, User } from "@/services/userService";
import * as userService from "@/services/userService";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useToast } from "@/hooks/use-toast";

type AuthStateType = {
  user: User | null;
  isAuthenticated: boolean;
};
interface AuthContextType extends AuthStateType {
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [authState, setAuthState] = useState<AuthStateType>({
    isAuthenticated: false,
    user: null,
  });
  const router = useRouter();

  useEffect(() => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const user = localStorage.getItem("user");

      if (accessToken && refreshToken) {
        setAuthState({
          ...authState,
          isAuthenticated: true,
          user: user ? JSON.parse(user) : null,
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async ({ username, password }: LoginDto) => {
    const response = await userService.login({ username, password });
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      userInfo,
    } = response.data || {};

    if (response?.success) {
      toast({
        title: "登录成功",
        description: response?.message,
        duration: 3000,
      });
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userInfo));
      setAuthState({
        isAuthenticated: true,
        user: userInfo,
      });
      router.push("/chat");
    }
  };
  const logout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAuthState({
        isAuthenticated: false,
        user: null,
      });
    } finally {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(" useAuth 必须在 AuthContext 内部使用");
  }
  return context;
};

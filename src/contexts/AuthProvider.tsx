"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { AuthContextType } from "./type";
import { useAuthState } from "./useAuthState";

/**
 * 创建认证上下文
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * 认证上下文提供者组件
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 使用认证状态Hook
  const {
    authState,
    loading,
    selectedGptModule,
    setSelectedGptModule,
    login,
    logout,
  } = useAuthState();

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loading,
        selectedGptModule,
        setSelectedGptModule,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * 认证上下文Hook
 * 用于在组件中获取认证状态和方法
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth 必须在 AuthContext 内部使用");
  }
  return context;
};

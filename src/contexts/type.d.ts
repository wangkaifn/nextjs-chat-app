/**
 * 用户认证相关类型定义
 */

import { User } from "@/services/userService";

/**
 * 认证状态类型
 */
export type AuthStateType = {
  /** 当前登录用户信息 */
  user: User | null;
  /** 是否已认证 */
  isAuthenticated: boolean;
};

/**
 * 认证上下文类型
 * 扩展认证状态，添加认证相关操作方法
 */
export interface AuthContextType extends AuthStateType {
  /** 加载状态 */
  loading: boolean;
  /** 登录方法 */
  login: (data: LoginDto) => Promise<void>;
  /** 登出方法 */
  logout: () => void;
  /** 当前选择的GPT模块 */
  selectedGptModule: string;
  /** 设置GPT模块的方法 */
  setSelectedGptModule: (value: string) => void;
}

/**
 * 登录请求数据类型
 */
export interface LoginDto {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
}

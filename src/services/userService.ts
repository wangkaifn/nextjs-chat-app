"use client";
import { ApiResponse } from "@/lib/api/types";
import apiClient from "@/lib/apiClient";
import Cookies from "js-cookie";
export interface User {
  id: string;
  email: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  username?: string;
  password: string;
  nickname?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

// {
//         userInfo: {
//           id: 'cm3ud606g0000srjht1f4iqr0',
//           email: '601987036@qq.com',
//           username: 'akaiwoshi',
//           nickname: null,
//           avatar: null,
//           createdAt: '2024-11-23T16:07:37.576Z',
//           updatedAt: '2024-11-23T16:07:37.576Z',
//         },
//         access_token:
//           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtM3VkNjA2ZzAwMDBzcmpodDFmNGlxcjAiLCJ1c2VybmFtZSI6ImFrYWl3b3NoaSIsImlhdCI6MTczMjM4MDU2NywiZXhwIjoxNzMyMzgyMzY3fQ.2Ie3z6-zgdmnHUQtJGQJWNDIgXAY1z_W4XP38FwdS_Q',
//         refresh_token:
//           'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtM3VkNjA2ZzAwMDBzcmpodDFmNGlxcjAiLCJpYXQiOjE3MzIzODA1NjcsImV4cCI6MTczMjk4NTM2N30.JB13wUbePshVZQhdjt5F8rE_l8Ndf8qZeMy_H8NtDfM',
//       }
export interface LoginVo {
  userInfo: User;
  access_token: string;
  refresh_token: string;
}

/**
 * 发送注册验证码
 * @param email 邮箱
 * @returns  返回验证码
 */
export const getRegisterCaptcha = async (email: string) => {
  const response = await apiClient.get(`/users/register-captcha`, {
    params: { address: email },
  });

  return response.data;
};

/**
 *
 * @param data 注册信息
 * @returns
 */
export const createUser = async (
  data: CreateUserDto
): Promise<ApiResponse<User>> => {
  const response = await apiClient.post<User>("/users/registry", data);

  return response.data;
};

export const login = async (data: LoginDto): Promise<ApiResponse<LoginVo>> => {
  const response = await apiClient.post<LoginVo>("/users/login", data);

  if (response.data.data && response.data.success) {
    Cookies.set("accessToken", response.data.data.access_token, { expires: 1 });
    Cookies.set("refreshToken", response.data.data.refresh_token, {
      expires: 7,
    });
  }
  return response.data;
};

/**
 *
 */
// /users/currentUser

// export const getCurrentUser = async (): Promise<
//   ApiResponse<boolean> | boolean
// > => {
//   // if (typeof window === 'undefined') return false;
//   const userInfoStr = localStorage?.getItem("userInfo");
//   if (!userInfoStr) {
//     return false;
//   }
//   const userInfo = JSON.parse(userInfoStr);

//   const response = await apiClient.get<ApiResponse<{ id: string }>>(
//     "/users/currentUser",
//     {
//       id: userInfo.id,
//     }
//   );
//   if (response.data.success) {
//     return true;
//   }
//   return false;
// };

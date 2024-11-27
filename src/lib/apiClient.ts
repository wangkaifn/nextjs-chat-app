/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { message } from "antd";
import { AUTH_STORAGE_KEYS } from "@/contexts/constants";
export type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
  success: boolean;
};

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 请求拦截器，添加 Access Token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // // 响应拦截器，处理 token 过期
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
          console.log("token过期");

          originalRequest._retry = true;

          const refreshToken = localStorage.getItem(
            AUTH_STORAGE_KEYS.REFRESH_TOKEN
          );

          if (refreshToken) {
            try {
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/refresh-tokens`,
                { refreshToken }
              );
              const {
                access_token: accessToken,
                refresh_token: newRefreshToken,
              } = response.data?.data;

              localStorage.setItem("accessToken", accessToken);
              localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);

              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
                localStorage.setItem(
                  AUTH_STORAGE_KEYS.REFRESH_TOKEN,
                  newRefreshToken
                );
              }
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${accessToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              console.log(refreshError);

              // 刷新 token 失败，重定向到登录页面
              if (window.location.pathname !== "/login") {
                window.location.href = "/login";
              }
              return Promise.reject(refreshError);
            }
          } else {
            // 没有 Refresh Token，重定向到登录页面
            if (window.location.pathname !== "/login") {
              window.location.href = "/login";
            }

            return Promise.reject(error.response.data);
          }
        }

        console.log(error.response.data);
        message.warning(error.response.data.message);
        return Promise.reject(error.response.data);
      }
    );
  }

  public get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.post<ApiResponse<T>>(url, data, config);
  }

  public put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.put<ApiResponse<T>>(url, data, config);
  }

  public delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> {
    return this.instance.delete<ApiResponse<T>>(url, config);
  }
}

const apiClient = new ApiClient();

export default apiClient;

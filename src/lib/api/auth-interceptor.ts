import { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { message } from "antd";
import { TokenManager } from "./token-manager";
import { ExtendedAxiosRequestConfig } from "./types";

/**
 * 认证拦截器类
 * 处理请求和响应的认证相关逻辑
 */
export class AuthInterceptor {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(private instance: AxiosInstance) {
    this.setupInterceptors();
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      this.handleRequest,
      this.handleRequestError
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response) => response,
      this.handleResponseError.bind(this)
    );
  }

  /**
   * 处理请求
   */
  private handleRequest = (config: InternalAxiosRequestConfig) => {
    const token = TokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  };

  /**
   * 处理请求错误
   */
  private handleRequestError = (error: any) => {
    return Promise.reject(error);
  };

  /**
   * 处理响应错误
   */
  private async handleResponseError(error: any) {
    const originalRequest = error.config as ExtendedAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        return this.addToRefreshQueue(originalRequest);
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      return this.refreshToken(originalRequest);
    }

    message.warning(error.response?.data?.message || "请求失败");
    return Promise.reject(error.response?.data);
  }

  /**
   * 添加到刷新队列
   */
  private addToRefreshQueue(request: ExtendedAxiosRequestConfig) {
    return new Promise((resolve) => {
      this.refreshSubscribers.push((token: string) => {
        request.headers.Authorization = `Bearer ${token}`;
        resolve(this.instance(request));
      });
    });
  }

  /**
   * 刷新令牌
   */
  private async refreshToken(originalRequest: ExtendedAxiosRequestConfig) {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        this.redirectToLogin();
        return Promise.reject(new Error("无刷新令牌"));
      }

      const response = await this.instance.post("/users/refresh-tokens", {
        refresh_token: refreshToken,
      });

      const { access_token: newAccessToken, refresh_token: newRefreshToken } =
        response.data?.data;

      TokenManager.updateTokens(newAccessToken, newRefreshToken);
      this.onRefreshSuccess(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return this.instance(originalRequest);
    } catch (error) {
      this.onRefreshFailure(error);
      return Promise.reject(error);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * 刷新成功处理
   */
  private onRefreshSuccess(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * 刷新失败处理
   */
  private onRefreshFailure(error: any): void {
    this.refreshSubscribers = [];
    this.redirectToLogin();
    console.error("令牌刷新失败:", error);
  }

  /**
   * 重定向到登录页
   */
  private redirectToLogin(): void {
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
}

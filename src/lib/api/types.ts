import { InternalAxiosRequestConfig } from "axios";

/**
 * API 响应的通用接口
 */
export type ApiResponse<T> = {
  /** 响应状态码 */
  code: number;
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message: string;
  /** 请求是否成功 */
  success: boolean;
};

/**
 * 扩展的 Axios 请求配置接口
 */
export interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

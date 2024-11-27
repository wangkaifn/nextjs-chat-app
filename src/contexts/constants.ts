/**
 * 认证相关的localStorage键名常量
 */
export const AUTH_STORAGE_KEYS = {
  /** 访问令牌 */
  ACCESS_TOKEN: "accessToken",
  /** 刷新令牌 */
  REFRESH_TOKEN: "refreshToken",
  /** 用户信息 */
  USER: "user",
  /** 默认GPT模块 */
  DEFAULT_GPT_MODULE: "defaultGptModule",
} as const;

import { AUTH_STORAGE_KEYS } from "@/contexts/constants";

/**
 * Token 管理器类
 * 处理 token 的存储、更新和校验
 */
export class TokenManager {
  /**
   * 获取访问令牌
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * 获取刷新令牌
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * 更新令牌
   * @param accessToken 新的访问令牌
   * @param refreshToken 新的刷新令牌（可选）
   */
  static updateTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) {
      localStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
  }

  /**
   * 清除所有令牌
   */
  static clearTokens(): void {
    localStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
  }
}

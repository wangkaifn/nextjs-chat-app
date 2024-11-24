import { getCurrentUser, User } from '@/services/userService';

export const getUserInfo = (): User | null => {
  const userInfoStr = localStorage.getItem('userInfo');
  if (userInfoStr) {
    return JSON.parse(userInfoStr);
  }

  return null;
};

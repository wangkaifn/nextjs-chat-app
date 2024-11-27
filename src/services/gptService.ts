import apiClient, { ApiResponse } from "@/lib/apiClient";

export interface GptModelList {
  id: number;
  name: string;
  desc?: string;
}

/**
 * 获取模型列表
 * @returns GptModelList[]
 */
export const getGptModelList = async (): Promise<
  ApiResponse<GptModelList[]>
> => {
  const gptModelList = await apiClient.get<ApiResponse<GptModelList[]>>(
    "/gptModel/list"
  );
  return gptModelList.data;
};

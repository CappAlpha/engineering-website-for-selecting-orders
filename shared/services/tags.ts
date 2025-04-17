import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const getAll = async (): Promise<string[]> => {
  return (await axiosInstance.get<string[]>(ApiRoutes.TAGS)).data;
};

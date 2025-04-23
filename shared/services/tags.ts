import { pageConfig } from "@/constants/pages";

import { axiosInstance } from "./instance";

export const getAll = async (): Promise<string[]> => {
  return (await axiosInstance.get<string[]>(pageConfig.TAGS)).data;
};

import { pageConfig } from "../constants/pages";
import { axiosInstance } from "./instance";

export const getAll = async (signal: AbortSignal): Promise<string[]> => {
  return (
    await axiosInstance.get<string[]>(pageConfig.TAGS, { signal: signal })
  ).data;
};

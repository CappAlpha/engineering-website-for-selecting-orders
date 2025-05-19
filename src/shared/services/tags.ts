import { PageConfig } from "../constants/pages";
import { axiosInstance } from "./instance";

export const getAll = async (signal: AbortSignal): Promise<string[]> => {
  return (
    await axiosInstance.get<string[]>(PageConfig.TAGS, { signal: signal })
  ).data;
};

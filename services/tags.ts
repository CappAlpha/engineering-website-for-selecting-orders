import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";
import { Tag } from "@prisma/client";

export const getAll = async (): Promise<Tag[]> => {
  return (await axiosInstance.get<Tag[]>(ApiRoutes.TAGS)).data;
};

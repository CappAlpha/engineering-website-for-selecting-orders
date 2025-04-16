import { axiosInstance } from "./instance";
import { Category } from "@prisma/client";
import { ApiRoutes } from "./constants";

export const getAll = async (): Promise<Category[]> => {
  return (await axiosInstance.get<Category[]>(ApiRoutes.CATEGORIES)).data;
};

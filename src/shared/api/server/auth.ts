import { User } from "@prisma/client";

import { axiosInstance } from "./instance";

export const getMe = async (signal: AbortSignal): Promise<User> => {
  return (await axiosInstance.get<User>("auth/me", { signal: signal })).data;
};

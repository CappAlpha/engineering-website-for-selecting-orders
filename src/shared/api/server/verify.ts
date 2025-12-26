import type {
  ResendRequest,
  ResendResponse,
  VerifyRequest,
  VerifyResponse,
} from "@/modules/Auth/entities/verify";

import { axiosInstance } from "./instance";

export const verifyEmail = async (
  payload: VerifyRequest,
  signal?: AbortSignal,
): Promise<VerifyResponse> => {
  return (
    await axiosInstance.post<VerifyResponse>("auth/verify", payload, { signal })
  ).data;
};

export const resendVerificationCode = async (
  payload: ResendRequest,
  signal?: AbortSignal,
): Promise<ResendResponse> => {
  return (
    await axiosInstance.post<ResendResponse>("auth/resend", payload, { signal })
  ).data;
};

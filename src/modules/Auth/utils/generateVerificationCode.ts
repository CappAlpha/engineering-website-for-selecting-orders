import crypto from "node:crypto";

import { OTP_TTL_MINUTES } from "../constants/verified";

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOtp = (code: string): string => {
  const pepper = process.env.OTP_PEPPER ?? "dev-pepper";
  return crypto
    .createHash("sha256")
    .update(code + pepper)
    .digest("hex");
};

export const getOtpExpiresAt = (): Date => {
  return new Date(Date.now() + OTP_TTL_MINUTES * 60_000);
};

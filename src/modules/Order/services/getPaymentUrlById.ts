import axios from "axios";

import type { PaymentCallbackData } from "../entities/orderResponse";

function parseCrystalPayDate(s: string): number {
  const [d, t] = s.split(" ");
  const [Y, M, D] = d.split("-").map(Number);
  const [h, m, sec] = t.split(":").map(Number);

  return Date.UTC(Y, M - 1, D, h, m, sec);
}

/**
 * Get payment url by id
 * @param paymentId - Payment id
 * @returns Payment url or null
 */
export const getPaymentUrlById = async (
  paymentId: string,
): Promise<string | null> => {
  try {
    const { data } = await axios.post<PaymentCallbackData>(
      "https://api.crystalpay.io/v3/invoice/info/",
      {
        auth_login: process.env.PAY_LOGIN,
        auth_secret: process.env.PAY_API_KEY,
        id: paymentId,
      },
    );

    if (data.error) return null;

    if (data.expired_at) {
      const expiredAt = parseCrystalPayDate(data.expired_at);
      if (expiredAt <= Date.now()) return null;
    }

    if (data.state === "payed") return null;

    return data.url ?? null;
  } catch (err) {
    console.error("[getPaymentUrlById] Request failed:", err);
    return null;
  }
};

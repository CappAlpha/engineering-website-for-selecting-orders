import axios from "axios";

import type { PaymentCallbackData } from "../entities/orderResponse";

/**
 * Get information about the already created account/invoice by paymentId and returns its url.
 * Return null if the information is not obtained / an error occurs / the invoice is not available.
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

    if (data.error) {
      console.error("[getPaymentUrlById] CrystalPay returned error:", data);
      return null;
    }

    return data.url ?? null;
  } catch (err) {
    console.error("[getPaymentUrlById] Request failed:", err);
    return null;
  }
};

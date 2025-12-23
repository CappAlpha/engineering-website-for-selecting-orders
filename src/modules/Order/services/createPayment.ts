import axios from "axios";

import { OrderConfig } from "@/modules/Order/constants/order";

import type { PaymentResponseData } from "../entities/orderResponse";

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

/**
 * Create payment in CrystalPay
 * @param details - Payment details
 * @returns Payment data
 */
export const createPayment = async (details: Props) => {
  const { data } = await axios.post<PaymentResponseData>(
    "https://api.crystalpay.io/v3/invoice/create/",
    {
      auth_login: process.env.PAY_LOGIN,
      auth_secret: process.env.PAY_API_KEY,
      amount: details.amount,
      type: "purchase",
      lifetime: OrderConfig.LIFETIME,
      description: details.description,
      extra: details.orderId,
      redirect_url: process.env.NEXT_PUBLIC_PAY_CALLBACK_URL,
    },
  );

  if (data.error) {
    throw new Error(`CrystalPay error: ${JSON.stringify(data)}`);
  }

  return data;
};

import axios from "axios";

import { OrderConfig } from "@/modules/Order/constants/order";

import { PaymentResponseData } from "../entities/orderResponse";

interface Props {
  description: string;
  orderId: number;
  amount: number;
}

/**
 * Creates a payment invoice using the CrystalPay API.
 *
 * @param details - An object containing the payment details.
 * @param details.description - Description of the payment.
 * @param details.orderId - Unique identifier for the order.
 * @param details.amount - The total amount to be paid.
 * @returns A promise that resolves with the response from the CrystalPay API.
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

  return data;
};

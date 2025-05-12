export type PaymentResponseData = {
  error: boolean;
  errors: [];
  id: string;
  url: string;
  type: "purchase" | "topup";
  rub_amount: number;
};

export type PaymentCallbackData = {
  error: false;
  errors: [];
  id: string;
  url: string;
  state:
    | "notpayed"
    | "processing"
    | "wrongamount"
    | "failed"
    | "payed"
    | "unavailable";
  type: "purchase" | "topup";
  method: string;
  required_method: string;
  amount_currency: string;
  rub_amount: string;
  initial_amount: string;
  remaining_amount: string;
  balance_amount: string;
  commission_amount: string;
  description: string;
  redirect_url: string;
  callback_url: string;
  extra: string;
  created_at: string;
  expired_at: string;
  final_at: string;
};

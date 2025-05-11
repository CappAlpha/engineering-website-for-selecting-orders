export interface OrderResponseProps {
  error: boolean;
  errors: [];
  id: string;
  url: string;
  type: "purchase" | "topup";
  rub_amount: number;
}

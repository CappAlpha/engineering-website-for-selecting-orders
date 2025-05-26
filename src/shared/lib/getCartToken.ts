import { cookies } from "next/headers";

import { CART_TOKEN_NAME } from "@/modules/Cart/constants/cart";

export const getCartToken = async () => {
  const cookieStore = await cookies();
  return cookieStore.get(CART_TOKEN_NAME)?.value;
};

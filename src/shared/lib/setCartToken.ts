import { cookies } from "next/headers";

import { CART_TOKEN_NAME } from "@/modules/Cart/constants/cart";

export const setCartCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set(CART_TOKEN_NAME, token);
};

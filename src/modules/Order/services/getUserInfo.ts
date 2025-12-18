import type { UseFormReturn } from "react-hook-form";

import type { CheckoutFormValues } from "@/modules/Order/schemas/checkoutFormSchema";
import { isRequestCanceled } from "@/shared/utils/isRequestCancelled";

import { Api } from "../../../shared/api/server/apiServer";

interface UserResponse {
  fullName: string;
  email: string;
  phone?: string;
}

export const getUserInfo = async (
  setError: (error: boolean) => void,
  form: UseFormReturn<CheckoutFormValues>,
) => {
  setError(false);

  const controller = new AbortController();

  try {
    const response = (await Api.auth.getMe(controller.signal)) as UserResponse;

    // TODO: change there and in reg form on separate fields
    const fullName = (response.fullName ?? "").trim().split(/\s+/);
    const firstName = fullName.shift() ?? "";
    const lastName = fullName.join(" ");

    form.reset({
      ...form.getValues(),
      firstName,
      lastName,
      email: response.email,
      phone: response.phone ?? "",
    });
  } catch (err) {
    if (isRequestCanceled(err)) {
      return () => controller.abort();
    }

    console.error("Error get user info:", err);
    setError(true);
  }

  return () => controller.abort();
};

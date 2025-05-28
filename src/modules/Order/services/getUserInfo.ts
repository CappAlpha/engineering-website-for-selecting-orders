import { UseFormReturn } from "react-hook-form";

import { CheckoutFormValues } from "@/modules/Order/schemas/checkoutFormSchema";

import { Api } from "../../../shared/services/apiClient";

interface UserResponse {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}

export const getUserInfo = async (
  setError: (error: boolean) => void,
  form: UseFormReturn<CheckoutFormValues>,
) => {
  setError(false);

  const controller = new AbortController();

  try {
    const response = (await Api.auth.getMe(controller.signal)) as UserResponse;

    const [firstName, lastName] = response.fullName.split(" ");

    form.reset({
      ...form.getValues(),
      firstName,
      lastName,
      email: response.email,
      phone: response.phone ?? "",
      address: response.address ?? "",
    });
  } catch (err) {
    if (
      err instanceof Error &&
      (err.name === "CanceledError" || err.message.includes("canceled"))
    ) {
      return;
    }
    console.error("Error get user info:", err);
    setError(true);
  }

  return () => controller.abort();
};

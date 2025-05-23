import { UseFormReturn } from "react-hook-form";

import { CheckoutFormValues } from "@/modules/Order/schemas/checkoutFormSchema";

import { Api } from "../../../shared/services/apiClient";

export const getUserInfo = async (
  setError: (error: boolean) => void,
  form: UseFormReturn<CheckoutFormValues>,
) => {
  setError(false);

  const controller = new AbortController();

  try {
    const response = await Api.auth.getMe(controller.signal);

    const [firstName, lastName] = response.fullName.split(" ");

    form.setValue("firstName", firstName);
    form.setValue("lastName", lastName);
    form.setValue("email", response.email);
    if (response?.phone) {
      form.setValue("phone", response.phone);
    }
    if (response?.address) {
      form.setValue("address", response.address);
    }
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      (err.name === "CanceledError" || err.message.includes("canceled"))
    ) {
      return;
    }
    console.error("Error searching products:", err);
    setError(true);
  }

  return () => controller.abort();
};

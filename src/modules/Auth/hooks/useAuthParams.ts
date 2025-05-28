import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const TOAST_MESSAGES = {
  paid: {
    message: "Заказ успешно оплачен! Информация отправлена на почту!",
    type: "success" as const,
  },
  verified: {
    message: "Почта успешно подтверждена!",
    type: "success" as const,
  },
  wrongCode: {
    message: "Недействительный код!",
    type: "error" as const,
  },
};

/**
 * Hook to check for query parameters from auth process and show
 * a toast notification based on the outcome.
 *
 * Checks for the following parameters:
 *   - paid: shows success toast with "Заказ успешно оплачен! Информация отправлена на почту!"
 *   - verified: shows success toast with "Почта успешно подтверждена!"
 *   - wrongCode: shows error toast with "Недействительный код!"
 *
 * Redirects to clean URL without parameters.
 */
export const useAuthParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Find the first parameter that exists in our config
    const param = Object.keys(TOAST_MESSAGES).find((key) =>
      searchParams.has(key),
    );

    if (param) {
      const { message, type } =
        TOAST_MESSAGES[param as keyof typeof TOAST_MESSAGES];

      router.replace("/");

      if (type === "success") {
        toast.success(message);
      } else {
        toast.error(message);
      }
    }
  }, [router, searchParams]);
};

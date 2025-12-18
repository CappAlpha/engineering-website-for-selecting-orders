// Util for checking whether the error is a cancellation request/abort.
import type { AxiosError } from "axios";
import { isAxiosError } from "axios";

export const isRequestCanceled = (err: unknown) => {
  if (typeof DOMException !== "undefined" && err instanceof DOMException) {
    if (err.name === "AbortError") return true;
  }

  if (isAxiosError(err)) {
    if ((err as AxiosError).code === "ERR_CANCELED") return true;
    if (typeof err.message === "string" && /cancel/i.test(err.message))
      return true;
  }

  if (err instanceof Error) {
    if (err.name === "CanceledError" || err.name === "AbortError") return true;
    if (typeof err.message === "string" && /cancel/i.test(err.message))
      return true;
  }

  return false;
};

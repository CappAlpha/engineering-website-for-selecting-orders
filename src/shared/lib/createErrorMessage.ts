export const createErrorMessage = (
  actionType: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  defaultMessage: string,
): string => {
  console.error(`[CART_ERROR] ${actionType}:`, error);

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
};

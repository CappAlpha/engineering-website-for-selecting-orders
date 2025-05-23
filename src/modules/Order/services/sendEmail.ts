import { ReactNode } from "react";
import { Resend } from "resend";

import { OrderConfig } from "@/modules/Order/constants/order";

/**
 * Sends an email using the Resend API.
 *
 * @param to - The recipient's email address.
 * @param subject - The subject of the email.
 * @param template - The ReactNode template for the email content.
 *
 * @returns A promise that resolves to the data of the sent email.
 * @throws Will throw an error if the email fails to send.
 */
export const sendEmail = async (
  to: string,
  subject: string,
  template: ReactNode,
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: OrderConfig.FROM_EMAIL,
    to,
    subject,
    react: template,
  });

  if (error) {
    throw error;
  }

  return data;
};

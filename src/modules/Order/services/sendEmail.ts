import type { ReactElement } from "react";
import { Resend } from "resend";

import { OrderConfig } from "@/modules/Order/constants/order";

const RESEND = new Resend(process.env.RESEND_API_KEY);

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
  template: ReactElement,
) => {
  try {
    const { data, error } = await RESEND.emails.send({
      from: OrderConfig.FROM_EMAIL,
      to,
      subject,
      react: template,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
};

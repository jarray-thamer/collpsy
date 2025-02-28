import nodemailer from "nodemailer";
import * as handlebars from "handlebars";
import  {PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE} from "../email/emailTemplate"



export async function sendMail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { APP_PASSWORD, APP_EMAIL } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: APP_EMAIL,
      pass: APP_PASSWORD,
    },
  });

  try {
    const testResult = await transport.verify();
  } catch (error) {
    console.error("Failed to verify email service:", error);
  }
  try {
    const sendResult = await transport.sendMail({
      from: APP_EMAIL,
      to,
      subject,
      html: body,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export function compileForgetPasswordTemplate(resetToken: string) {
  const template = handlebars.compile(PASSWORD_RESET_REQUEST_TEMPLATE);
  const htmlBody = template({ resetURL: resetToken });
  return htmlBody;
}

export function compileEmailVerificationTemplate(verificationToken: string) {
  const template = handlebars.compile(VERIFICATION_EMAIL_TEMPLATE);
  const htmlBody = template({ verificationCode: verificationToken });
  return htmlBody;
}
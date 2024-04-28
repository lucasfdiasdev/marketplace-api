import ejs from "ejs";
import "dotenv/config";
import path from "path";
import nodemailer, { Transporter } from "nodemailer";

import { IEmailOptions } from "../interfaces/mail.interface";

export const sendMail = async (options: IEmailOptions): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  // get the path to the email template file
  const templatePath = path.join(__dirname, `../mails/`, template);

  // render the email template
  const html: string = await ejs.renderFile(templatePath, data);

  // send the email
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

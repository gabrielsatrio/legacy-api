import config from '@/config/main';
import chalk from 'chalk';
import nodemailer from 'nodemailer';
import { mapError } from './map-error';

export const sendEmail = async (
  to: string,
  subject: string,
  content: string
): Promise<void> => {
  try {
    const { mail } = config;
    const transporter = nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      secure: false
    });
    const info = await transporter.sendMail({
      from: mail.sender,
      to,
      subject,
      html: content
    } as any);
    console.log(
      chalk.green.bold('Message sent: %s'),
      chalk.yellow.bold(info.messageId)
    );
  } catch (err) {
    throw new Error(mapError(err));
  }
};

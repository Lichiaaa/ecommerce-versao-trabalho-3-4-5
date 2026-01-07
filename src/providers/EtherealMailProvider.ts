import nodemailer from 'nodemailer';
import { getMailClient } from '../lib/mail';
import logger from '../lib/logger';
import { IMailProvider, MailMessage, MailSendResult } from './IMailProvider';

export class EtherealMailProvider implements IMailProvider {
  async sendMail(message: MailMessage): Promise<MailSendResult> {
    const transporter = await getMailClient();

    const info = await transporter.sendMail({
      from: '"E-commerce Lab" <no-reply@ecommerce.local>',
      to: message.to,
      subject: message.subject,
      html: message.html,
    });

    const testUrl = nodemailer.getTestMessageUrl(info);
    const previewUrl = typeof testUrl === 'string' ? testUrl : undefined;

    logger.info('Email enviado', {
      to: message.to,
      subject: message.subject,
      messageId: info.messageId,
      previewUrl,
    });

    return {
      messageId: info.messageId,
      previewUrl,
    };
  }
}
export type MailMessage = {
  to: string;
  subject: string;
  html: string;
};

export type MailSendResult = {
  messageId: string;
  previewUrl?: string;
};

export interface IMailProvider {
  sendMail(message: MailMessage): Promise<MailSendResult>;
}
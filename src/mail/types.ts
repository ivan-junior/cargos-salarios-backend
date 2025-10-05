export type MailTemplate = 'invite-user' | 'forgot-password' | 'password-reset';

export type SendEmailOptions = {
  to: string;
  subject: string;
  template: MailTemplate;
  context: Record<string, any>;
};



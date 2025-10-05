import path from 'path';
import fs from 'fs';
import nodemailer, { Transporter } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { SendEmailOptions } from './types';
import { env } from '@/env';

let cachedTransporter: Transporter | null = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = env.SMTP_HOST;
  const port = env.SMTP_PORT ? Number(env.SMTP_PORT) : undefined;
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    console.warn('[mail] Variáveis SMTP ausentes. Emails serão apenas logados no console.');
  }

  const transporter = nodemailer.createTransport(
    host && port && user && pass
      ? {
          host,
          secure: port === 465,
          port,
          auth: { user, pass },
        }
      : // Fallback: transporter "dummy" que não envia de fato
        {
          jsonTransport: true,
        } as any
  );

  // Resolve dos templates: tenta dist/mail/templates e cai para src/mail/templates
  const distTemplates = path.resolve(__dirname, 'templates');
  const srcTemplates = path.resolve(process.cwd(), 'src/mail/templates');
  const templatesDir = fs.existsSync(distTemplates) ? distTemplates : srcTemplates;

  transporter.use(
    'compile',
    hbs({
      viewEngine: {
        extname: '.hbs',
        layoutsDir: templatesDir,
        defaultLayout: false,
        partialsDir: templatesDir,
      } as any,
      viewPath: templatesDir,
      extName: '.hbs',
    })
  );

  cachedTransporter = transporter;
  return transporter;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const fromName = env.MAIL_FROM_NAME || 'Equipe';
  const fromEmail = env.MAIL_FROM_EMAIL || 'no-reply@example.com';

  const transporter = getTransporter();

  const templateName = options.template; // folder name matches template

  if (env.NODE_ENV === 'development') {
    options.to = env.EMAIL_TEST_TO
  }

  try {
    const result =await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      template: templateName + '/template',
      context: options.context,
    } as any);
    console.log('Email sent successfully to %s with response %s', options.to, result.response)
  } catch (err) {
    console.error('[mail] Falha ao enviar e-mail:', err);
  }
}



import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  JWT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  MAIL_FROM_NAME: z.string(),
  MAIL_FROM_EMAIL: z.string(),
  FRONTEND_URL: z.string(),
  EMAIL_TEST_TO: z.string(),
})

export const env = envSchema.parse(process.env)

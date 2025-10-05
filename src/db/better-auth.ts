import { betterAuth, BetterAuthOptions } from 'better-auth'
import { APIError } from "better-auth/api";
import { openAPI, organization } from 'better-auth/plugins'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient, User, UserRole } from '@prisma/client'
import { sendEmail } from '@/mail/mailer';
import { env } from '@/env';

const prisma = new PrismaClient()
const authConfig = {
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async (data) => {
      await sendEmail({
        to: data.user.email,
        subject: 'Redefinir senha',
        template: 'forgot-password',
        context: {
          resetLink: `${env.FRONTEND_URL}/reset-password?token=${data.token}`
        }
      })
    },
    onPasswordReset: async (data) => {
      await sendEmail({
        to: data.user.email,
        subject: 'Senha atualizada',
        template: 'password-reset',
        context: {}
      })
    }

  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: true
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async(user, context) => {
          if (!context?.body?.role) {
            throw new APIError('BAD_REQUEST', {
              code: 'USER_ROLE_REQUIRED',
              message: 'O papel do usuário é obrigatório'
            })
          }

          return {
            data: user
          }
        },
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24
  },
  advanced: {
    database: {
      generateId: false
    },
  },
  plugins: [organization({
    allowUserToCreateOrganization: async (user) => {
      if (user.role && user.role !== UserRole.SUPERADMIN) {
        return false
      }
      return true
    },
    async sendInvitationEmail(data) {
      await sendEmail({
        to: data.email,
        subject: `Convite para se juntar à ${data.organization.name}`,
        template: 'invite-user',
        context: {
          organizationName: data.organization.name,
          inviteLink: `${env.FRONTEND_URL}/accept-invitation?token=${data.id}`
        }
      })
    },
  }), openAPI()]
} satisfies BetterAuthOptions
export const auth = betterAuth({
  ...authConfig
}) as ReturnType<typeof betterAuth<typeof authConfig>>

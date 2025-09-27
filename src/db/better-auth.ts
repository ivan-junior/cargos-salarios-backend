import { betterAuth, BetterAuthOptions } from 'better-auth'
import { APIError } from "better-auth/api";
import { openAPI, organization } from 'better-auth/plugins'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const authConfig = {
  database: prismaAdapter(prisma, {
    provider: 'postgresql'
  }),
  emailAndPassword: {
    enabled: true
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
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24
  },
  advanced: {
    database: {
      generateId: false
    }
  },
  plugins: [organization({}), openAPI()]
} satisfies BetterAuthOptions
export const auth = betterAuth({
  ...authConfig
}) as ReturnType<typeof betterAuth<typeof authConfig>>

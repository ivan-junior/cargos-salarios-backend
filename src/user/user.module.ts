import { UserService } from './user.service'
import { UserController } from './user.controller'
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/db/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

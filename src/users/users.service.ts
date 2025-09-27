/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  //Handled by better-auth
}

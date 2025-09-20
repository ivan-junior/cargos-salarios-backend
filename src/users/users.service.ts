/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/db/prisma.service'
import { CreateUserDto } from './dto/users.dto'
import * as bcrypt from 'bcrypt'
import { Role } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10)
    const user = await this.prisma.user.create({
      data: { ...dto, password: hashed, role: dto.role as Role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })
    return { message: 'User created successfully', user }
  }
}

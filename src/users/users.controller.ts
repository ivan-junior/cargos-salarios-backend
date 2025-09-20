/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from './dto/users.dto'
import { UsersService } from './users.service'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }
}

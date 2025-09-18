import { PartialType } from '@nestjs/mapped-types'
import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  password: string

  @IsEnum(Role)
  role?: Role
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

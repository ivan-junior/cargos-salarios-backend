import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string

  @IsEmail()
  @ApiProperty()
  email: string

  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string

  @IsEnum(Role)
  @ApiProperty({ enum: Role })
  role?: Role
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

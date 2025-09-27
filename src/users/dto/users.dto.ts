import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

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

  @ApiProperty()
  role?: string
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

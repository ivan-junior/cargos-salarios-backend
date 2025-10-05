import { IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  family?: string

  @IsOptional()
  @IsString()
  @MaxLength(100)
  area?: string

  @IsOptional()
  @IsString()
  @MaxLength(50)
  level?: string
}

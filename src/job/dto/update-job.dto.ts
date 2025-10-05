import { IsString, IsOptional, MaxLength } from 'class-validator'

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string

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

import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { JobStatus } from '@prisma/client'

export class FilterJobDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  family?: string

  @IsOptional()
  @IsString()
  area?: string

  @IsOptional()
  @IsString()
  level?: string

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number = 10

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0
}

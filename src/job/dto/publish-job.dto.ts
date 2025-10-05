import { IsObject, IsNotEmpty } from 'class-validator'

export class PublishJobDto {
  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>
}

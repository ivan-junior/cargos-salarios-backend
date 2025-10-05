import { Module } from '@nestjs/common'
import { JobService } from './job.service'
import { JobController } from './job.controller'
import { PrismaModule } from '../db/prisma.module'

@Module({
  imports: [PrismaModule],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService]
})
export class JobModule {}

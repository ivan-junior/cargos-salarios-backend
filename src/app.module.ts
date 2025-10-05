import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { auth } from './db/better-auth'
import { JobModule } from './job/job.module'

@Module({
  imports: [ConfigModule.forRoot(), AuthModule.forRoot(auth), JobModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

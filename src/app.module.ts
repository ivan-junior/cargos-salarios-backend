import { UsersModule } from './users/users.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import '@/env'

@Module({
  imports: [ConfigModule.forRoot(), UsersModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

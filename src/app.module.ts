import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { auth } from './db/better-auth'

@Module({
  imports: [ConfigModule.forRoot(), AuthModule.forRoot(auth)],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

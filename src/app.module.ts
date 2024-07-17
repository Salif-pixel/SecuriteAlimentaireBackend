import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SocketModule } from './Socket/SocketModule';
import { AppGateway } from './app.gatway';
import {AppController} from "./app.controller";

@Module({
  imports: [UserModule,SocketModule, AuthModule,SocketModule,ConfigModule.forRoot({
    isGlobal: true,
  }),],
  controllers: [AppController],
  providers: [AppGateway],
})
export class AppModule {}

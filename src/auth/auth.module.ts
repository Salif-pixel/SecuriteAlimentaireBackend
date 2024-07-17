import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/user/prisma.service';
import { JwtModule , JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { mailerService } from 'src/mailer.service';

@Module({
  imports:[
    JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,PrismaService,JwtStrategy,UserService,mailerService],
})
export class AuthModule {}

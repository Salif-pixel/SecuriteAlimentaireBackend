import { Body,Controller,Post,Get,Request, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './jwt.strategy';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user-dto';
import { LogUserDto } from './dto/login-user-dto';
import {resetUserPasswordDto } from './dto/reset-user-password-dto';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService:AuthService,private readonly userService:UserService){}

    @Post('login')
    async login(@Body() authBody:LogUserDto) {
        
        return await this.authService.login({authBody});
    }
    @Post('register')
    async register(@Body() registerBody:CreateUserDto) {
        
        return await this.authService.register({registerBody});
    }
    @Post('request-reset-password')
    async resetUserPasswordRequest(@Body('email') email:string) {
        return await this.authService.resetUserPasswordRequest({email});
    }
    @Post('reset-password')
    async resetUserPassword(@Body() resetPassword:resetUserPasswordDto) {
        return await this.authService.resetUserPassword({resetPassword});
    }
    @Get('verify-reset-password-token')
    async verifyResetPasswordToken(@Query('token') token:string) {
        return await this.authService.verifyResetPasswordToken({token});
    }
    @UseGuards(JwtAuthGuard)
    @Get()
    async authenticateUser(@Request() request:RequestWithUser){
        return await this.userService.getUser({userId:request.user.userId});
    }
    @UseGuards(JwtAuthGuard)
    @Get('logout')
    async DisconnectUser(@Request() request:RequestWithUser){
        return await this.authService.OfflineUser({userId:request.user.userId});
    }
   
}

import { Body, Controller, Get, Post, Delete, Put, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRoleGuard } from './user-role-guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserUpdateDto } from 'src/auth/dto/user-input-dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(UserRoleGuard)
  getUsers(@Body('email') email: string) {
    return this.UserService.getUsers({ email });
  }
  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  getUser(@Param('userId') userId: string) {
    return this.UserService.getUser({ userId });
  }
  @Delete('delete/:email')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param('email') email: string) {
    return this.UserService.deleteUser({ email });
  }
  @Put('update/:email')
  @UseGuards(JwtAuthGuard)
  UpdateUser(@Param('email') email: string,
    @Body() newData: UserUpdateDto) {
    return this.UserService.updateUser({ email, newData });
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }

}

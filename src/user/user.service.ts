import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserUpdateDto } from 'src/auth/dto/user-input-dto';
import { SocketService } from 'src/Socket/SocketService';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService,private readonly socketService: SocketService) {}
  async getUsers({ email }: { email: string }) {

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      throw new Error('cet utilisateur n\'existe pas');
    }
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        role: true,
        Datenaissance: true,
        Profil: true,
        Background: true,
        Online:true,
        propos:true,
      },
    });

    return users
  }

  async getUser({ userId }: { userId: string }) {
    const users = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, firstName: true, role: true, Datenaissance: true, Profil: true,
        Background: true,Online:true,propos:true,
      },
    });

    return users
  }
  async deleteUser({ email }: { email: string }) {
    const users = await this.prisma.user.delete({
      where: { email },
    });

    return users
  }
  async updateUser({ email, newData }: { email: string, newData: UserUpdateDto }) {
    const updatedUser = await this.prisma.user.update({
      where: { email },
      data: newData,
    });
   this.socketService.server.emit('send-user-update',updatedUser)
    return updatedUser;
  }
}

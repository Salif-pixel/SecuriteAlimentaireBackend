import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(private prisma: PrismaService) {}
   async canActivate(
        context: ExecutionContext,
    ): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        console.log(request)   // Supposons que vous avez un objet utilisateur avec une propriété "role"
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: request.body.email,
            },
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        if (existingUser.role === 'ADMIN') {
            return true; // Autoriser l'accès si l'utilisateur a le rôle d'administrateur
        }
        return false; // Refuser l'accès si l'utilisateur n'a pas le rôle d'administrateur
        }
}
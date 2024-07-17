import { Injectable } from '@nestjs/common';
import { PrismaService } from '../user/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user-dto';
import { mailerService } from 'src/mailer.service';
import { createId } from "@paralleldrive/cuid2";
import { LogUserDto } from './dto/login-user-dto';
import { resetUserPasswordDto } from './dto/reset-user-password-dto';
import { use } from 'passport';
import { SocketService } from 'src/Socket/SocketService';
@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,private readonly socketService:SocketService, private readonly jwtService: JwtService, private readonly mailerService: mailerService) { }
    async login({ authBody }: { authBody: LogUserDto }) {
        const { email, password } = authBody;
        
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!existingUser) {
            throw new Error('User not found');
        }
        const isPasswordValid = await this.isPasswordValid({ password, hashedPassword: existingUser.password });
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        return this.authenticateUser({ userId: existingUser.id });
    }
    async register({ registerBody }: { registerBody: CreateUserDto }) {
        const { email, firstName, password, Datenaissance } = registerBody;


        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new Error('Un compte existe déjà avec cet email');
        }
        const hashedPassword = await this.hashPassword({ password });
        const CreatedUser = await this.prisma.user.create({
            data: {
                email,
                firstName,
                password: hashedPassword,
                Datenaissance,
            },
        });
        await this.mailerService.sendCreatedAccountEmail({ recipient: email, firstName });
        return {
            email: CreatedUser.email,
            firstName: CreatedUser.firstName,
            Datenaissance: CreatedUser.Datenaissance,
            password: "",
        };
    }
    async resetUserPasswordRequest({ email }: { email: string }) {

        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (!existingUser) {
                throw new Error("l'utilisateur n'existe pas");
            }
            if (existingUser.isResettingPassword) {
                throw new Error('Un email a déjà été envoyé pour réinitialiser votre mot de passe');
            }
            const createdId = createId();
            await this.prisma.user.update({
                where: {
                    email,
                },
                data: {
                    isResettingPassword: true,
                    resetPasswordToken: createdId,
                },
            });
            await this.mailerService.sendRequestedPasswordEmail({ recipient: email, firstName: existingUser.firstName, token: createdId });
            return {
                error: false,
                message: 'Un email a été envoyé pour réinitialiser votre mot de passe',
            }
        } catch (error) {
            throw new Error('An error occured while processing your request');
        }
    }
    async verifyResetPasswordToken({ token }: { token: string }) {

        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    resetPasswordToken: token,
                },
            });
            if (!existingUser) {
                throw new Error("l'utilisateur n'existe pas");
            }
            if (existingUser.isResettingPassword === false) {
                throw new Error("Aucune demande de réinitialisation de mot de passe n\'a été faite pour cet utilisateur");
            }

            return {
                error: false,
                message: 'Le token est valide',
            }
        } catch (error) {
            throw new Error('An error occured while processing your request');
        }

    }
    async resetUserPassword({ resetPassword }: { resetPassword: resetUserPasswordDto }) {
        const { password, token } = resetPassword;
        try {
            const existingUser = await this.prisma.user.findUnique({
                where: {
                    resetPasswordToken: token,
                },
            });
            if (!existingUser) {
                throw new Error("l'utilisateur n'existe pas");
            }
            if (existingUser.isResettingPassword === false) {
                throw new Error("aucune demande de réinitialisation de mot de passe n\'a été faite pour cet utilisateur");
            }
            await this.prisma.user.update({
                where: {
                    email: existingUser.email,
                },
                data: {
                    isResettingPassword: false,
                    password: await this.hashPassword({ password }),
                },
            });

            return {
                error: false,
                message: 'votre mot de passe a été réinitialisé avec succès',
            }
        } catch (error) {
            throw new Error('An error occured while processing your request');
        }
    }
    private async hashPassword({ password }: { password: string }) {
        const hashedPassword = await hash(password, 10);
        return hashedPassword;
    };
    private async isPasswordValid({ password, hashedPassword }: { password: string, hashedPassword: string }) {
        const isPasswordValid = await compare(password, hashedPassword);
        return isPasswordValid;
    };
    private async authenticateUser({ userId }: UserPayload) {
        await this.OnlineUser({ userId })
        const Users = await this.prisma.user.findMany({
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
        this.socketService.server.emit('user-connected',Users
            
        )

        const payload: UserPayload = { userId };
        return {
            access_token: this.jwtService.sign(payload),
        };

    };
    private async OnlineUser({ userId }: UserPayload) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        user.Online = true;
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: user,
        });
    }
    async OfflineUser({ userId }: UserPayload) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        user.Online = false;
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: user,
        });
        const Users = await this.prisma.user.findMany({
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
        this.socketService.server.emit('user-disconnected',Users
            
        )
    }
}


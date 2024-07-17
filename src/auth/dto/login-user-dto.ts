import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class LogUserDto {
    @IsEmail(
        {},
        {
            message: 'vous devez entrer un email valide',
        },
    )
    email: string;

    @IsNotEmpty()
    @MinLength(6, {
        message: 'vous devez entrer un mot de passe valide de 6 caractères minimum',
    },
    )

    password: string;


}
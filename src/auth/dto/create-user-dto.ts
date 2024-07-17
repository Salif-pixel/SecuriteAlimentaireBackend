import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail(
        {},
        {
            message: 'vous devez entrer un email valide',
        },
    )
    email: string;

    @IsString(
        {
            message: 'vous devez entrer un prénom valide',
        },
    )
    firstName: string;
    @IsString(
        {
            message: 'vous devez entrer une date de naissance valide',
        },
    )
    Datenaissance: string;
        
    @IsNotEmpty()
    @MinLength(6, {
        message: 'vous devez entrer un mot de passe valide de 6 caractères minimum',
    },
    )

    password: string;


}
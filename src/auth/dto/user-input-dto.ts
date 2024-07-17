import { IsBase64, IsBoolean, IsEmail, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class UserUpdateDto {
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

    @IsBoolean(
        {
            message: 'vous devez entrer une valeur valide',
        },
    )
    Online: boolean;

    @IsString(
        {
            message: 'vous devez entrer une photo de profil valide',
        },
    )
    Profil: string;

    @IsString(
        {
            message: 'vous devez entrer une image de fond valide',
        },
    )
    Background: string;
    @IsString(
        {
            message: 'vous devez entrer une image de fond valide',
        },
    )
    propos: string;


}
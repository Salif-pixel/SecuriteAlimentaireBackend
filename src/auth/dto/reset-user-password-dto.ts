import {  IsNotEmpty, IsString, MinLength } from 'class-validator';

export class resetUserPasswordDto {
    @IsNotEmpty()
  @MinLength(6, {
        message: 'vous devez entrer un mot de passe valide de 6 caractères minimum',
  })
    password: string;
  @IsNotEmpty()
    @IsString()
  token: string;

}
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El correo o nombre de usuario es obligatorio' })
  @IsString({ message: 'El identificador debe ser una cadena de texto' })
  credencial!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'La contraseña debe contener al menos una mayúscula y un número',
  })
  password!: string;
}
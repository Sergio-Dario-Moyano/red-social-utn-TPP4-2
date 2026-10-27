import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class RegistroUsuarioDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  nombre!: string;

  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  apellido!: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  correo!: string;

  @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  nombreUsuario!: string;

  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'La contraseña debe contener al menos una mayúscula y un número',
  })
  password!: string;

  @IsDateString(
    {},
    { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' },
  )
  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  fechaNacimiento!: string;

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción breve es obligatoria' })
  @MaxLength(250, {
    message: 'La descripción breve no puede superar los 250 caracteres',
  })
  descripcionBreve!: string;

  @IsOptional()
  @IsIn(['usuario', 'administrador'], {
    message: 'El perfil debe ser usuario o administrador',
  })
  perfil?: string;
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({ timestamps: true, collection: 'usuarios' })
export class Usuario {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  apellido: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  correo: string;

  @Prop({ required: true, unique: true, trim: true })
  nombreUsuario: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fechaNacimiento: Date;

  @Prop({ required: true, maxlength: 250, trim: true })
  descripcionBreve: string;

  @Prop({ required: true })
  fotoPerfil: string;

  @Prop({ default: 'usuario', enum: ['usuario', 'administrador'] })
  perfil: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
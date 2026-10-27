import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema.js';
import { UsuariosRepository } from './usuario.repository.js';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
  providers: [UsuariosRepository],
  exports: [UsuariosRepository],
})
export class UsuariosModule {}
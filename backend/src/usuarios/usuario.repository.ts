import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from './schemas/usuario.schema.js';

@Injectable()
export class UsuariosRepository {
  constructor(
    @InjectModel(Usuario.name)
    private readonly usuarioModel: Model<UsuarioDocument>,
  ) {}

  async crear(datosUsuario: Partial<Usuario>): Promise<UsuarioDocument> {
    const usuarioCreado = new this.usuarioModel(datosUsuario);
    return usuarioCreado.save();
  }

  async buscarPorCorreo(correo: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel
      .findOne({ correo: correo.toLowerCase().trim() })
      .exec();
  }

  async buscarPorNombreUsuario(nombreUsuario: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel
      .findOne({ nombreUsuario: nombreUsuario.trim() })
      .exec();
  }

  // Permite autenticar tanto con el correo como con el nombre de usuario
  async buscarPorCredencial(credencial: string): Promise<UsuarioDocument | null> {
    const valor = credencial.trim();
    return this.usuarioModel
      .findOne({
        $or: [
          { correo: valor.toLowerCase() },
          { nombreUsuario: valor },
        ],
      })
      .exec();
  }

  async buscarPorId(id: string): Promise<UsuarioDocument | null> {
    return this.usuarioModel.findById(id).select('-password').exec();
  }
}
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosRepository } from '../usuarios/usuario.repository.js';
import { LoginDto } from './dto/login.dto.js';
import { RegistroUsuarioDto } from '../usuarios/dto/registro-usuario.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosRepository: UsuariosRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registrarUsuario(dto: RegistroUsuarioDto, fotoPerfilUrl: string) {
    const existeCorreo = await this.usuariosRepository.buscarPorCorreo(dto.correo);
    if (existeCorreo) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const existeUsername = await this.usuariosRepository.buscarPorNombreUsuario(dto.nombreUsuario);
    if (existeUsername) {
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    // Si dto.fechaNacimiento viene como "YYYY-MM-DD":
    const [anio, mes, dia] = dto.fechaNacimiento.split('-').map(Number);
    const fechaUtc = new Date(Date.UTC(anio, mes - 1, dia, 12, 0, 0));

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const nuevoUsuario = await this.usuariosRepository.crear({
      ...dto,
      correo: dto.correo.toLowerCase().trim(),
      nombreUsuario: dto.nombreUsuario.trim(),
      password: hashedPassword,
      fechaNacimiento: fechaUtc,
      fotoPerfil: fotoPerfilUrl,
      perfil: dto.perfil || 'usuario',
    });

    const payload = {
      sub: nuevoUsuario._id,
      correo: nuevoUsuario.correo,
      perfil: nuevoUsuario.perfil,
    };
    const token = this.jwtService.sign(payload);

    return { usuario: nuevoUsuario, token };
  }

  async validarYAutenticar(dto: LoginDto) {
    const usuario = await this.usuariosRepository.buscarPorCredencial(dto.credencial);
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(dto.password, usuario.password);
    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario._id,
      correo: usuario.correo,
      perfil: usuario.perfil,
    };
    const token = this.jwtService.sign(payload);

    return { usuario, token };
  }
}
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
    const correoLimpio = dto.correo.toLowerCase().trim();
    const usernameLimpio = dto.nombreUsuario.trim();

    console.log('--- INICIO PROCESO DE REGISTRO ---');
    console.log('Evaluando correo recibido:', correoLimpio);
    console.log('Evaluando username recibido:', usernameLimpio);

    // 1. Verificación estricta de correo existente
    const existeCorreo = await this.usuariosRepository.buscarPorCorreo(correoLimpio);
    if (existeCorreo) {
      console.warn('⚠️ Se encontró coincidencia de correo en MongoDB:');
      console.warn('ID en DB:', existeCorreo._id);
      console.warn('Correo en DB:', existeCorreo.correo);
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // 2. Verificación estricta de nombre de usuario existente
    const existeUsername = await this.usuariosRepository.buscarPorNombreUsuario(usernameLimpio);
    if (existeUsername) {
      console.warn('⚠️ Se encontró coincidencia de usuario en MongoDB:');
      console.warn('ID en DB:', existeUsername._id);
      console.warn('Username en DB:', existeUsername.nombreUsuario);
      throw new ConflictException('El nombre de usuario ya está registrado');
    }

    // 3. Procesamiento seguro de fecha
    let fechaUtc: Date;
    if (dto.fechaNacimiento && dto.fechaNacimiento.includes('-')) {
      const [anio, mes, dia] = dto.fechaNacimiento.split('-').map(Number);
      fechaUtc = new Date(Date.UTC(anio, mes - 1, dia, 12, 0, 0));
    } else {
      fechaUtc = new Date(dto.fechaNacimiento);
    }

    // 4. Hash seguro de contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 5. Inserción en base de datos
    const nuevoUsuario = await this.usuariosRepository.crear({
      nombre: dto.nombre.trim(),
      apellido: dto.apellido.trim(),
      correo: correoLimpio,
      nombreUsuario: usernameLimpio,
      password: hashedPassword,
      fechaNacimiento: fechaUtc,
      descripcionBreve: dto.descripcionBreve.trim(),
      fotoPerfil: fotoPerfilUrl,
      perfil: dto.perfil || 'usuario',
    });

    console.log('✅ Usuario creado exitosamente en MongoDB con ID:', nuevoUsuario._id);

    const payload = {
      sub: nuevoUsuario._id,
      correo: nuevoUsuario.correo,
      perfil: nuevoUsuario.perfil,
    };
    const token = this.jwtService.sign(payload);

    return { usuario: nuevoUsuario, token };
  }

  async validarYAutenticar(dto: LoginDto) {
    const credencialLimpia = dto.credencial.trim();
    const usuario = await this.usuariosRepository.buscarPorCredencial(credencialLimpia);
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
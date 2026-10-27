import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpStatus,
  HttpCode,
  UnauthorizedException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { RegistroUsuarioDto } from '../usuarios/dto/registro-usuario.dto.js';
import { JwtService } from '@nestjs/jwt';
import { UsuariosRepository } from '../usuarios/usuario.repository.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usuariosRepository: UsuariosRepository,
  ) {}

  @Post('registro')
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      storage: diskStorage({
        destination: './uploads/perfiles',
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `avatar-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Solo se admiten archivos de imagen (jpg, jpeg, png, webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async registro(
    @Body() registroDto: RegistroUsuarioDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('La imagen de perfil es obligatoria');
      }

      const fotoPerfilUrl = `http://localhost:3000/uploads/perfiles/${file.filename}`;

      const { usuario, token } = await this.authService.registrarUsuario(
        registroDto,
        fotoPerfilUrl,
      );

      res.cookie('autorizacion', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      return res.status(HttpStatus.CREATED).json({
        mensaje: 'Usuario registrado exitosamente',
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          nombreUsuario: usuario.nombreUsuario,
          fechaNacimiento: usuario.fechaNacimiento,
          descripcionBreve: usuario.descripcionBreve,
          fotoPerfil: usuario.fotoPerfil,
          perfil: usuario.perfil,
        },
      });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ mensaje: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensaje: 'Error interno en el servidor',
        detalle: error.message || error,
      });
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      const { usuario, token } = await this.authService.validarYAutenticar(loginDto);

      res.cookie('autorizacion', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      return res.status(HttpStatus.OK).json({
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          nombreUsuario: usuario.nombreUsuario,
          fechaNacimiento: usuario.fechaNacimiento,
          descripcionBreve: usuario.descripcionBreve,
          fotoPerfil: usuario.fotoPerfil,
          perfil: usuario.perfil,
        },
      });
    } catch (error: any) {
      if (error.status) {
        return res.status(error.status).json({ mensaje: error.message });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        mensaje: 'Error interno en el servidor',
      });
    }
  }

  @Get('perfil')
  async obtenerPerfil(@Req() req: Request, @Res() res: Response) {
    try {
      const token = req.cookies?.['autorizacion'];
      if (!token) {
        throw new UnauthorizedException('No hay sesión activa');
      }

      const decoded = this.jwtService.verify(token);
      const usuario = await this.usuariosRepository.buscarPorId(decoded.sub);

      if (!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      return res.status(HttpStatus.OK).json({
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        nombreUsuario: usuario.nombreUsuario,
        fechaNacimiento: usuario.fechaNacimiento,
        descripcionBreve: usuario.descripcionBreve,
        fotoPerfil: usuario.fotoPerfil,
        perfil: usuario.perfil,
      });
    } catch (err) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        mensaje: 'Sesión no válida o expirada',
      });
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.cookie('autorizacion', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
    });

    return res.status(HttpStatus.OK).json({
      mensaje: 'Sesión cerrada correctamente',
    });
  }
}
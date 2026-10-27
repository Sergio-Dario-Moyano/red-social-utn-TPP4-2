import { Controller, Get, Post, Body } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service.js';
import type { IPublicacion } from './publicaciones.service.js';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Get()
  obtenerTodas(): IPublicacion[] {
    return this.publicacionesService.obtenerTodas();
  }

  @Post()
  crear(
    @Body() datos: { titulo: string; contenido: string; autor: string },
  ): IPublicacion {
    return this.publicacionesService.crear(datos);
  }
}
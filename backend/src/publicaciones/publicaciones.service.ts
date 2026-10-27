import { Injectable } from '@nestjs/common';

export interface IPublicacion {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  fechaCreacion: Date;
}

@Injectable()
export class PublicacionesService {
  // Lista inicial en memoria para responder peticiones en el Sprint 1
  private publicaciones: IPublicacion[] = [
    {
      id: '1',
      titulo: 'Bienvenida a UTN-BUGS',
      contenido: 'Espacio creado para compartir apuntes, dudas y recursos académicos.',
      autor: 'smoyano',
      fechaCreacion: new Date(),
    },
  ];

  obtenerTodas(): IPublicacion[] {
    return this.publicaciones;
  }

  crear(datos: { titulo: string; contenido: string; autor: string }): IPublicacion {
    const nuevaPublicacion: IPublicacion = {
      id: `${Date.now()}`,
      titulo: datos.titulo,
      contenido: datos.contenido,
      autor: datos.autor,
      fechaCreacion: new Date(),
    };

    this.publicaciones.unshift(nuevaPublicacion);
    return nuevaPublicacion;
  }
}
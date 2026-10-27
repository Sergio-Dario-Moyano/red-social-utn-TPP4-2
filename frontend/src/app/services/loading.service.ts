import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Signal booleano para controlar la visibilidad del spinner
  cargando = signal<boolean>(false);

  // Mensaje contextual opcional (ej: "Iniciando sesión...", "Cargando perfil...")
  mensaje = signal<string>('Cargando...');

  mostrar(mensaje: string = 'Cargando...'): void {
    this.mensaje.set(mensaje);
    this.cargando.set(true);
  }

  ocultar(): void {
    this.cargando.set(false);
  }
}

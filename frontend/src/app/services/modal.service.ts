import { Injectable, signal } from '@angular/core';

export interface ModalConfig {
  titulo: string;
  mensaje: string;
  textoBoton?: string;           // Texto para modal tipo alerta
  textoConfirmar?: string;       // Texto botón aceptar en confirmación
  textoCancelar?: string;        // Texto botón cancelar en confirmación
  esConfirmacion?: boolean;      // Bandera para mostrar 1 o 2 botones
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpen = signal<boolean>(false);
  config = signal<ModalConfig | null>(null);

  // Manejador de la promesa asíncrona (devuelve boolean)
  private resolverPromesa: ((valor: boolean) => void) | null = null;

  // Para avisos simples (1 botón)
  alerta(config: Omit<ModalConfig, 'esConfirmacion'>): Promise<void> {
    this.config.set({ ...config, esConfirmacion: false });
    this.isOpen.set(true);

    return new Promise((resolve) => {
      this.resolverPromesa = () => resolve();
    });
  }

  // Para preguntas críticas: "¿Está seguro...?" (2 botones)
  confirmar(config: Omit<ModalConfig, 'esConfirmacion'>): Promise<boolean> {
    this.config.set({
      ...config,
      esConfirmacion: true,
      textoConfirmar: config.textoConfirmar || 'Aceptar',
      textoCancelar: config.textoCancelar || 'Cancelar',
    });
    this.isOpen.set(true);

    return new Promise((resolve) => {
      this.resolverPromesa = (confirmado: boolean) => resolve(confirmado);
    });
  }

  // Cierra respondiendo según el botón presionado
  cerrar(resultado: boolean = false) {
    this.isOpen.set(false);
    if (this.resolverPromesa) {
      this.resolverPromesa(resultado);
      this.resolverPromesa = null;
    }
  }
}

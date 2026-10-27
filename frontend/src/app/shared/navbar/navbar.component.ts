import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  menuAbierto: boolean = false;

  get usuario() {
    return this.authService.usuarioActual();
  }

  async onLogout(): Promise<void> {
    this.menuAbierto = false;

    const acepto = await this.modalService.confirmar({
      titulo: 'Cerrar Sesión',
      mensaje: '¿Estás seguro de que deseas cerrar sesión?',
      textoConfirmar: 'Sí, cerrar sesión',
      textoCancelar: 'Cancelar',
    });

    if (!acepto) return;

    this.authService.logout().subscribe({
      next: async () => {
        await this.modalService.alerta({
          titulo: 'Sesión Finalizada',
          mensaje: 'Has cerrado sesión correctamente.',
          textoBoton: 'Entendido',
        });
        this.router.navigate(['/login']);
      },
      error: async () => {
        this.router.navigate(['/login']);
      },
    });
  }
}

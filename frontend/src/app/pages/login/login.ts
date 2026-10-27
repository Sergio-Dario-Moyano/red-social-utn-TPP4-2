import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);

  cargando = signal<boolean>(false);
  mostrarClave = signal<boolean>(false);

  // Mínimo 8 caracteres, al menos una mayúscula y un número
  private readonly passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  loginForm = new FormGroup({
    credencial: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(this.passwordRegex)
      ]
    })
  });

  toggleVerClave(): void {
    this.mostrarClave.update((v) => !v);
  }

  tieneError(control: 'credencial' | 'password', tipo: string): boolean {
    const c = this.loginForm.controls[control];
    return c.touched && c.hasError(tipo);
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.cargando()) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: async (res) => {
        this.cargando.set(false);
        await this.modalService.alerta({
          titulo: 'Bienvenido',
          mensaje: `Hola ${res.usuario.nombre}, iniciaste sesión correctamente.`,
          textoBoton: 'Entrar'
        });
        this.router.navigate(['/publicaciones']);
      },
      error: async (err) => {
        this.cargando.set(false);
        const mensaje = err.error?.mensaje || err.error?.message || 'Credenciales inválidas';
        await this.modalService.alerta({
          titulo: 'Error de Acceso',
          mensaje: Array.isArray(mensaje) ? mensaje.join(', ') : mensaje,
          textoBoton: 'Entendido'
        });
      }
    });
  }
}



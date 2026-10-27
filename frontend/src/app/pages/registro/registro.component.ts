import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../services/modal.service';

export const coincidenciaClavesValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const clave = control.get('password')?.value;
  const repetirClave = control.get('repetirPassword')?.value;

  if (!clave || !repetirClave) {
    return null;
  }

  return clave === repetirClave ? null : { noCoincide: true };
};

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);

  cargando = signal<boolean>(false);
  archivoSeleccionado: File | null = null;
  errorArchivo = signal<string | null>(null);

  // Exige al menos 8 caracteres, una mayúscula y un número
  private readonly passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  formRegistro: FormGroup = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.passwordRegex),
        ],
      ],
      repetirPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcionBreve: ['', [Validators.required, Validators.maxLength(250)]],
    },
    { validators: coincidenciaClavesValidator },
  );

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
      this.errorArchivo.set(null);
    } else {
      this.archivoSeleccionado = null;
    }
  }

  tieneError(campo: string, error: string): boolean {
    const control = this.formRegistro.get(campo);
    return !!(control && control.touched && control.hasError(error));
  }

  onSubmit(): void {
    if (!this.archivoSeleccionado) {
      this.errorArchivo.set('La imagen de perfil es obligatoria.');
    }

    if (this.formRegistro.invalid || !this.archivoSeleccionado || this.cargando()) {
      this.formRegistro.markAllAsTouched();
      return;
    }

    this.cargando.set(true);

    const formData = new FormData();
    formData.append('nombre', this.formRegistro.get('nombre')?.value);
    formData.append('apellido', this.formRegistro.get('apellido')?.value);
    formData.append('correo', this.formRegistro.get('correo')?.value);
    formData.append('nombreUsuario', this.formRegistro.get('nombreUsuario')?.value);
    formData.append('password', this.formRegistro.get('password')?.value);
    formData.append('fechaNacimiento', this.formRegistro.get('fechaNacimiento')?.value);
    formData.append('descripcionBreve', this.formRegistro.get('descripcionBreve')?.value);
    formData.append('imagenPerfil', this.archivoSeleccionado);

    this.authService.registro(formData).subscribe({
      next: async (res) => {
        this.cargando.set(false);
        await this.modalService.alerta({
          titulo: '¡Registro Exitoso!',
          mensaje: `Bienvenido/a ${res.usuario.nombre}. Tu cuenta fue creada correctamente.`,
          textoBoton: 'Continuar',
        });
        this.router.navigate(['/publicaciones']);
      },
      error: async (err) => {
        this.cargando.set(false);
        const mensaje =
          err.error?.mensaje || err.error?.message || 'No se pudo completar el registro.';
        await this.modalService.alerta({
          titulo: 'Error en el Registro',
          mensaje: Array.isArray(mensaje) ? mensaje.join(', ') : mensaje,
          textoBoton: 'Reintentar',
        });
      },
    });
  }
}

import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {
  readonly authService = inject(AuthService);
}

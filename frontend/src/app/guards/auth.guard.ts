import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Si ya se verificó la sesión y el usuario está en memoria, permite el acceso directo
  if (authService.sesionVerificada()) {
    if (authService.usuarioActual()) {
      return true;
    }
    router.navigate(['/login']);
    return false;
  }

  // 2. Si el usuario recargó la app (F5), consulta el estado al backend
  return authService.verificarSesion().pipe(
    map((estaAutenticado) => {
      if (estaAutenticado) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};

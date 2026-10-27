import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard'

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
    title: 'Iniciar Sesión | UTN-BUGS'
  },
  {
    path: 'registro',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./pages/registro/registro.component').then(m => m.RegistroComponent),
    title: 'Registro de Usuario | UTN-BUGS'
  },
  {
    path: 'publicaciones',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/publicaciones/publicaciones').then(m => m.Publicaciones),
    title: 'Publicaciones | UTN-BUGS'
  },
  {
    path: 'mi-perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/mi-perfil/mi-perfil').then(m => m.MiPerfil),
    title: 'Mi Perfil | UTN-BUGS'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map, delay, finalize } from 'rxjs';
import { IAuthResponse, ILogin, IUsuario } from '../models/auth-interfaces';
import { LoadingService } from './loading.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly loadingService = inject(LoadingService);

  // Conectar con la URL de producción
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  // Simulación de delay del servidor en milisegundos (1 segundo)
  private readonly LATENCIA_SIMULADA_MS = 1000;

  usuarioActual = signal<IUsuario | null>(null);
  sesionVerificada = signal<boolean>(false);

  registro(datos: FormData): Observable<IAuthResponse> {
    this.loadingService.mostrar('Creando tu cuenta en UTN-BUGS...');

    return this.http.post<IAuthResponse>(`${this.apiUrl}/registro`, datos, {
      withCredentials: true,
    }).pipe(
      delay(this.LATENCIA_SIMULADA_MS),
      tap((res) => {
        this.usuarioActual.set(res.usuario);
        this.sesionVerificada.set(true);
      }),
      finalize(() => this.loadingService.ocultar())
    );
  }

  login(credenciales: ILogin): Observable<IAuthResponse> {
    this.loadingService.mostrar('Iniciando sesión...');

    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, credenciales, {
      withCredentials: true,
    }).pipe(
      delay(this.LATENCIA_SIMULADA_MS),
      tap((res) => {
        this.usuarioActual.set(res.usuario);
        this.sesionVerificada.set(true);
      }),
      finalize(() => this.loadingService.ocultar())
    );
  }

  logout(): Observable<{ mensaje: string }> {
    this.loadingService.mostrar('Cerrando sesión...');

    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/logout`,
      {},
      { withCredentials: true }
    ).pipe(
      delay(800),
      tap(() => {
        this.usuarioActual.set(null);
        this.sesionVerificada.set(true);
      }),
      finalize(() => this.loadingService.ocultar())
    );
  }

  verificarSesion(): Observable<boolean> {
    this.loadingService.mostrar('Verificando credenciales...');

    return this.http.get<IUsuario>(`${this.apiUrl}/perfil`, {
      withCredentials: true,
    }).pipe(
      delay(this.LATENCIA_SIMULADA_MS),
      map((usuario) => {
        this.usuarioActual.set(usuario);
        this.sesionVerificada.set(true);
        return true;
      }),
      catchError(() => {
        this.usuarioActual.set(null);
        this.sesionVerificada.set(true);
        return of(false);
      }),
      finalize(() => this.loadingService.ocultar())
    );
  }
}

















// import { Injectable, inject, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, tap, catchError, of, map, delay, finalize } from 'rxjs';
// import { IAuthResponse, ILogin, IUsuario } from '../models/auth-interfaces';
// import { LoadingService } from './loading.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private readonly http = inject(HttpClient);
//   private readonly loadingService = inject(LoadingService);
//   private readonly apiUrl = 'http://localhost:3000/api/auth';

//   // Simulación de delay del servidor en milisegundos (1 segundo)
//   private readonly LATENCIA_SIMULADA_MS = 1000;

//   usuarioActual = signal<IUsuario | null>(null);
//   sesionVerificada = signal<boolean>(false);

//   registro(datos: FormData): Observable<IAuthResponse> {
//     this.loadingService.mostrar('Creando tu cuenta en UTN-BUGS...');

//     return this.http.post<IAuthResponse>(`${this.apiUrl}/registro`, datos, {
//       withCredentials: true,
//     }).pipe(
//       delay(this.LATENCIA_SIMULADA_MS),
//       tap((res) => {
//         this.usuarioActual.set(res.usuario);
//         this.sesionVerificada.set(true);
//       }),
//       finalize(() => this.loadingService.ocultar())
//     );
//   }

//   login(credenciales: ILogin): Observable<IAuthResponse> {
//     this.loadingService.mostrar('Iniciando sesión...');

//     return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, credenciales, {
//       withCredentials: true,
//     }).pipe(
//       delay(this.LATENCIA_SIMULADA_MS),
//       tap((res) => {
//         this.usuarioActual.set(res.usuario);
//         this.sesionVerificada.set(true);
//       }),
//       finalize(() => this.loadingService.ocultar())
//     );
//   }

//   logout(): Observable<{ mensaje: string }> {
//     this.loadingService.mostrar('Cerrando sesión...');

//     return this.http.post<{ mensaje: string }>(
//       `${this.apiUrl}/logout`,
//       {},
//       { withCredentials: true }
//     ).pipe(
//       delay(800),
//       tap(() => {
//         this.usuarioActual.set(null);
//         this.sesionVerificada.set(true);
//       }),
//       finalize(() => this.loadingService.ocultar())
//     );
//   }

//   verificarSesion(): Observable<boolean> {
//     this.loadingService.mostrar('Verificando credenciales...');

//     return this.http.get<IUsuario>(`${this.apiUrl}/perfil`, {
//       withCredentials: true,
//     }).pipe(
//       delay(this.LATENCIA_SIMULADA_MS),
//       map((usuario) => {
//         this.usuarioActual.set(usuario);
//         this.sesionVerificada.set(true);
//         return true;
//       }),
//       catchError(() => {
//         this.usuarioActual.set(null);
//         this.sesionVerificada.set(true);
//         return of(false);
//       }),
//       finalize(() => this.loadingService.ocultar())
//     );
//   }
// }

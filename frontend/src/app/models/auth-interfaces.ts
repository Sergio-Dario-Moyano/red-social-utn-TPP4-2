// frontend/src/app/models/auth-interfaces.ts
export interface ILogin {
  credencial: string;
  password: string;
}

export interface IRegistroUsuario {
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  password: string;
  repetirPassword: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  perfil?: 'usuario' | 'administrador';
  imagenPerfil?: File;
}

export interface IUsuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  nombreUsuario: string;
  fechaNacimiento: string;
  descripcionBreve: string;
  fotoPerfil: string;
  perfil: 'usuario' | 'administrador';
}

export interface IAuthResponse {
  mensaje: string;
  usuario: IUsuario;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface RegisterCredentials {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthRole {
  id?: string | number;
  nombre: string;
}

export interface AuthUser {
  id: string | number;
  nombre: string;
  correo: string;
  roles?: AuthRole | null;
}

export interface AuthSession {
  user: AuthUser;
  accessToken?: string;
}

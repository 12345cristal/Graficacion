// Interfaz para datos de usuario/cuenta
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'administrador' | 'investigador' | 'usuario';
  fechaCreacion?: string;
  activo: boolean;
}

// Interfaz para credenciales de login
export interface Credenciales {
  email: string;
  contrasena: string;
  recordarme?: boolean;
}

// Interfaz para datos de registro
export interface DatosRegistro {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  confirmarContrasena: string;
  rol: 'administrador' | 'investigador' | 'analista';
  terminos: boolean;
}

// Interfaz para respuesta de autenticación
export interface RespuestaAutenticacion {
  exito: boolean;
  mensaje: string;
  usuario?: Usuario;
  token?: string;
}

// Interfaz para validación de formulario
export interface ErrorValidacion {
  campo: string;
  mensaje: string;
}

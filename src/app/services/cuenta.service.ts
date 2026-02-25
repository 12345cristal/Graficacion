import { Injectable } from '@angular/core';
import { Usuario, Credenciales, DatosRegistro, RespuestaAutenticacion } from '../interfaces/cuenta.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {

  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$: Observable<Usuario | null> = this.usuarioActualSubject.asObservable();

  private autenticadoSubject = new BehaviorSubject<boolean>(false);
  public autenticado$: Observable<boolean> = this.autenticadoSubject.asObservable();

  constructor() {
    this.verificarUsuarioGuardado();
  }

  // Obtener usuario actual
  obtenerUsuarioActual(): Usuario | null {
    return this.usuarioActualSubject.value;
  }

  // Verificar si está autenticado
  estaAutenticado(): boolean {
    return this.autenticadoSubject.value;
  }

  // Iniciar sesión
  iniciarSesion(credenciales: Credenciales): Promise<RespuestaAutenticacion> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usuarios = this.obtenerUsuarios();
        const usuarioEncontrado = usuarios.find(u => u.email === credenciales.email);

        if (usuarioEncontrado && (usuarioEncontrado as any).contrasena === credenciales.contrasena) {
          this.usuarioActualSubject.next(usuarioEncontrado);
          this.autenticadoSubject.next(true);
          localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));

          if (credenciales.recordarme) {
            this.guardarCredenciales(credenciales);
          }

          resolve({
            exito: true,
            mensaje: `¡Bienvenido ${usuarioEncontrado.nombre}!`,
            usuario: usuarioEncontrado,
            token: this.generarToken()
          });
        } else {
          resolve({
            exito: false,
            mensaje: 'Email o contraseña incorrectos'
          });
        }
      }, 1000);
    });
  }

  // Registrarse
  registrarse(datos: DatosRegistro): Promise<RespuestaAutenticacion> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const usuarios = this.obtenerUsuarios();

        if (usuarios.some(u => u.email === datos.email)) {
          resolve({
            exito: false,
            mensaje: 'Este email ya está registrado'
          });
          return;
        }

        const nuevoUsuario: Usuario = {
          id: Date.now(),
          nombre: datos.nombre,
          apellido: datos.apellido,
          email: datos.email,
          rol: 'usuario',
          fechaCreacion: new Date().toISOString(),
          activo: true
        };

        usuarios.push({ ...nuevoUsuario, contrasena: datos.contrasena });
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        resolve({
          exito: true,
          mensaje: 'Registro exitoso. Ahora puedes iniciar sesión',
          usuario: nuevoUsuario
        });
      }, 1000);
    });
  }

  // Cerrar sesión
  cerrarSesion(): void {
    this.usuarioActualSubject.next(null);
    this.autenticadoSubject.next(false);
    localStorage.removeItem('usuarioActual');
    localStorage.removeItem('recordarCredenciales');
  }

  // Obtener todos los usuarios
  private obtenerUsuarios(): any[] {
    const usuarios = localStorage.getItem('usuarios');
    return usuarios ? JSON.parse(usuarios) : [];
  }

  // Guardar credenciales
  private guardarCredenciales(credenciales: Credenciales): void {
    localStorage.setItem('recordarCredenciales', JSON.stringify(credenciales));
  }

  // Cargar credenciales guardadas
  obtenerCredencialesGuardadas(): Credenciales | null {
    const credenciales = localStorage.getItem('recordarCredenciales');
    return credenciales ? JSON.parse(credenciales) : null;
  }

  // Validar email
  esEmailValido(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Validar contraseña
  esContraseñaValida(contraseña: string): boolean {
    return contraseña !== undefined && contraseña !== null && contraseña.length >= 6;
  }

  // Generar token (simulado)
  private generarToken(): string {
    return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Verificar usuario guardado en localStorage
  private verificarUsuarioGuardado(): void {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.usuarioActualSubject.next(usuario);
        this.autenticadoSubject.next(true);
      } catch (e) {
        console.error('Error al cargar usuario guardado:', e);
      }
    }
  }

  // Actualizar perfil de usuario
  actualizarPerfil(cambios: Partial<Usuario>): void {
    const usuarioActual = this.usuarioActualSubject.value;
    if (usuarioActual) {
      const usuarioActualizado = { ...usuarioActual, ...cambios };
      this.usuarioActualSubject.next(usuarioActualizado);
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioActualizado));
    }
  }

  // Cambiar contraseña
  cambiarContrasena(contraseniaActual: string, contraseniaNueva: string): Promise<boolean> {
    return new Promise((resolve) => {
      const usuarioActual = this.usuarioActualSubject.value;
      if (!usuarioActual) {
        resolve(false);
        return;
      }

      const usuarios = this.obtenerUsuarios();
      const usuario = usuarios.find(u => u.id === usuarioActual.id);

      if (usuario && (usuario as any).contrasena === contraseniaActual) {
        (usuario as any).contrasena = contraseniaNueva;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        resolve(true);
      } else {
        resolve(false);
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  modo: 'login' | 'registro' | 'reset' = 'login';

  login = {
    correo: '',
    contrasena: ''
  };

  registro = {
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  };

  resetCorreo = '';

  cargando = false;
  error = '';
  exito = '';
  mostrarPassword = false;

  get loginValido(): boolean {
    return (
      this.esEmailValido(this.login.correo) &&
      this.login.contrasena.trim().length >= 6
    );
  }

  get registroValido(): boolean {
    return (
      this.registro.nombre.trim().length > 0 &&
      this.esEmailValido(this.registro.correo) &&
      this.registro.contrasena.length >= 6 &&
      this.registro.contrasena === this.registro.confirmarContrasena
    );
  }

  cambiarModo(modo: 'login' | 'registro' | 'reset') {
    this.modo = modo;
    this.error = '';
    this.exito = '';
  }

  iniciarSesion() {
    if (!this.loginValido) {
      this.error = 'Verifica tu correo y contraseña';
      return;
    }

    this.cargando = true;

    setTimeout(() => {
      this.exito = 'Sesión iniciada correctamente';
      this.cargando = false;
    }, 1200);
  }

  registrarse() {
    if (!this.registroValido) {
      this.error = 'Revisa los datos del registro';
      return;
    }

    this.cargando = true;

    setTimeout(() => {
      this.exito = 'Cuenta creada correctamente';
      this.modo = 'login';
      this.cargando = false;
    }, 1200);
  }

  enviarReset() {
    if (!this.esEmailValido(this.resetCorreo)) {
      this.error = 'Ingresa un correo válido';
      return;
    }

    this.cargando = true;

    setTimeout(() => {
      this.exito = 'Enlace enviado a tu correo';
      this.cargando = false;
    }, 1200);
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  esEmailValido(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
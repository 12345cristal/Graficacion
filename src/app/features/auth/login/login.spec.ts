import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

declare var jasmine: any;

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, CommonModule, FormsModule, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start in login mode', () => {
    expect(component.modo).toBe('login');
  });

  it('should validate email correctly', () => {
    expect(component.esEmailValido('test@example.com')).toBe(true);
    expect(component.esEmailValido('invalid-email')).toBe(false);
    expect(component.esEmailValido('test@')).toBe(false);
  });

  it('should toggle between login and registro', () => {
    expect(component.modo).toBe('login');
    component.cambiarModo('registro');
    expect(component.modo).toBe('registro');
    component.cambiarModo('login');
    expect(component.modo).toBe('login');
  });

  it('should toggle show password', () => {
    expect(component.mostrarContrasena).toBe(false);
    component.toggleMostrarContrasena();
    expect(component.mostrarContrasena).toBe(true);
  });

  it('should validate login form', () => {
    component.credenciales = { email: '', contrasena: '', recordarme: false };
    component.iniciarSesion();
    expect(component.errorMensaje).toBeTruthy();
  });

  it('should validate email format on login', () => {
    component.credenciales = { email: 'invalid', contrasena: 'password', recordarme: false };
    component.iniciarSesion();
    expect(component.errorMensaje).toBe('Por favor ingresa un email válido');
  });

  it('should validate registro form', () => {
    component.registro = {
      nombre: '',
      apellido: '',
      email: '',
      contrasena: '',
      confirmarContrasena: '',
      rol: 'analista',
      terminos: false
    };
    component.registrarse();
    expect(component.errorMensaje).toBeDefined();
  });

  it('should validate password length on registro', () => {
    component.registro = {
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      contrasena: '123',
      confirmarContrasena: '123',
      rol: 'analista',
      terminos: true
    };
    component.registrarse();
    expect(component.errorMensaje).toContain('mínimo 6 caracteres');
  });

  it('should validate password confirmation', () => {
    component.registro = {
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      contrasena: 'password',
      confirmarContrasena: 'different',
      rol: 'analista',
      terminos: true
    };
    component.registrarse();
    expect(component.errorMensaje).toContain('Las contraseñas no coinciden');
  });

  it('should require terms acceptance', () => {
    component.registro = {
      nombre: 'Test',
      apellido: 'User',
      email: 'test@example.com',
      contrasena: 'password',
      confirmarContrasena: 'password',
      rol: 'analista',
      terminos: false
    };
    component.registrarse();
    expect(component.errorMensaje).toContain('términos');
  });

  it('should clear forms', () => {
    component.credenciales = { email: 'test@example.com', contrasena: 'password', recordarme: true };
    component.limpiarFormularios();
    expect(component.credenciales.email).toBe('');
    expect(component.credenciales.contrasena).toBe('');
  });
});

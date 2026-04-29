import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  isSubmitting = false;
  message = '';

  readonly loginForm;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly auth: AuthService
  ) {
    this.loginForm = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  async submit(): Promise<void> {
    if (this.loginForm.invalid || this.isSubmitting) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.message = '';

    try {
      const user = await this.auth.login(this.loginForm.getRawValue());
      this.message = `Bienvenido ${user.nombre}`;
    } catch {
      this.message = 'No pudimos iniciar sesion. Revisa tus credenciales.';
    } finally {
      this.isSubmitting = false;
    }
  }
}

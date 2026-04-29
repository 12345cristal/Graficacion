import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterCredentials
} from '../interfaces/auth.interface';
import { SupabaseService } from './supabase.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly storage = inject(TokenStorageService);
  private readonly sessionState = signal<AuthSession | null>(this.storage.getSession());

  readonly session = this.sessionState.asReadonly();
  readonly user = computed(() => this.sessionState()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionState() !== null);

  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const { email, password, remember } = credentials;
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('*, roles(nombre)')
      .eq('correo', email.trim().toLowerCase())
      .eq('password', password)
      .single();

    if (error || !data) {
      throw error ?? new Error('Credenciales invalidas');
    }

    const session: AuthSession = { user: data as AuthUser };
    this.storage.saveSession(session, remember);
    this.sessionState.set(session);

    return session.user;
  }

  async register(credentials: RegisterCredentials): Promise<AuthUser> {
    const { fullName, email, password } = credentials;
    const { data, error } = await this.supabase
      .from('usuarios')
      .insert({
        nombre: fullName.trim(),
        correo: email.trim().toLowerCase(),
        password
      })
      .select('*, roles(nombre)')
      .single();

    if (error || !data) {
      throw error ?? new Error('No se pudo crear la cuenta');
    }

    return data as AuthUser;
  }

  getUser(): AuthUser | null {
    return this.user();
  }

  getRol(): string | null {
    return this.user()?.roles?.nombre ?? null;
  }

  logout(): void {
    this.storage.clear();
    this.sessionState.set(null);
  }
}

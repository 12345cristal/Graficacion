import { Injectable } from '@angular/core';
import { AuthSession } from '../interfaces/auth.interface';

const SESSION_KEY = 'requify_session';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getSession(): AuthSession | null {
    const rawSession = localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);

    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as AuthSession;
    } catch {
      this.clear();
      return null;
    }
  }

  saveSession(session: AuthSession, remember: boolean): void {
    this.clear();
    const targetStorage = remember ? localStorage : sessionStorage;
    targetStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  getToken(): string | null {
    return this.getSession()?.accessToken ?? null;
  }

  clear(): void {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }
}

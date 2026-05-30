import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  nome: string;
  email: string;
  tipo: 'COMUM' | 'ORGANIZADOR';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly currentUser = signal<User | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('borali_user');
      if (savedUser) {
        try {
          this.currentUser.set(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('borali_user');
        }
      }
    }
  }

  login(email: string, senha: string): Observable<User> {
    return this.http.post<User>('http://localhost:8080/usuarios/login', { email, senha }).pipe(
      tap((user) => {
        this.currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('borali_user', JSON.stringify(user));
        }
      })
    );
  }

  register(nome: string, email: string, senha: string, tipo: string): Observable<User> {
    return this.http.post<User>('http://localhost:8080/usuarios', { nome, email, senha, tipo }).pipe(
      tap((user) => {
        this.currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('borali_user', JSON.stringify(user));
        }
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('borali_user');
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }
}

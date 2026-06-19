import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioResponse } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  readonly currentUser = signal<UsuarioResponse | null>(null);

  constructor() {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('borali_user');
      if (storedUser) {
        try {
          this.currentUser.set(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('borali_user');
        }
      }
    }
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  login(email: string, senha: string): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap(user => {
        this.currentUser.set(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('borali_user', JSON.stringify(user));
        }
      })
    );
  }

  register(nome: string, email: string, senha: string, tipo: string): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(this.apiUrl, { nome, email, senha, tipo }).pipe(
      tap(user => {
        this.currentUser.set(user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('borali_user', JSON.stringify(user));
        }
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('borali_user');
    }
  }
}

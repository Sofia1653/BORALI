import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/favoritos';

  listarFavoritosUsuario(usuarioId: number): Observable<EventoResponse[]> {
    return this.http.get<EventoResponse[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  favoritar(usuarioId: number, eventoId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}?usuarioId=${usuarioId}&eventoId=${eventoId}`, {});
  }

  desfavoritar(usuarioId: number, eventoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?usuarioId=${usuarioId}&eventoId=${eventoId}`);
  }
}

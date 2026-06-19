import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { EventoResponse } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/favoritos`;

  readonly favoritos = signal<EventoResponse[]>([]);

  listarFavoritosUsuario(usuarioId: number): Observable<EventoResponse[]> {
    return this.http.get<EventoResponse[]>(`${this.apiUrl}/usuario/${usuarioId}`).pipe(
      tap(eventos => this.favoritos.set(eventos))
    );
  }

  favoritar(usuarioId: number, eventoId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}?usuarioId=${usuarioId}&eventoId=${eventoId}`, {}).pipe(
      switchMap(() => this.listarFavoritosUsuario(usuarioId)),
      map(() => undefined)
    );
  }

  desfavoritar(usuarioId: number, eventoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}?usuarioId=${usuarioId}&eventoId=${eventoId}`).pipe(
      tap(() => this.favoritos.update(list => list.filter(e => e.id !== eventoId)))
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/usuarios';

  buscarUsuarioPorId(id: number): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  adicionarInteresse(usuarioId: number, categoriaId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${usuarioId}/interesses/${categoriaId}`, {});
  }

  removerInteresse(usuarioId: number, categoriaId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${usuarioId}/interesses/${categoriaId}`);
  }
}

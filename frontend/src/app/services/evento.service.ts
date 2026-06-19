import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventoResponse, EventoRequest, CategoriaResponse } from '../models/models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  listarTodos(): Observable<EventoResponse[]> {
    return this.http.get<EventoResponse[]>(`${this.apiUrl}/eventos`);
  }

  buscarPorId(id: number): Observable<EventoResponse> {
    return this.http.get<EventoResponse>(`${this.apiUrl}/eventos/${id}`);
  }

  criar(evento: EventoRequest): Observable<EventoResponse> {
    return this.http.post<EventoResponse>(`${this.apiUrl}/eventos`, evento);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eventos/${id}`);
  }

  listarCategorias(): Observable<CategoriaResponse[]> {
    return this.http.get<CategoriaResponse[]>(`${this.apiUrl}/categorias`);
  }
}

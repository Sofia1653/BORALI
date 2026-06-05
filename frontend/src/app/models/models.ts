export interface EventoResponse {
  id: number;
  nome: string;
  descricao: string;
  dataHora: string; // ISO LocalDateTime string e.g. "2026-07-04T19:00:00"
  preco: number;
  linkExterno: string;
  organizadorNome: string;
  endereco: string;
  bairro: string;
  latitude: number;
  longitude: number;
  categorias: string[];
  infraestruturas: string[];
}

export interface EventoRequest {
  nome: string;
  descricao?: string;
  dataHora: string; // ISO string
  preco?: number;
  linkExterno?: string;
  organizadorId: number;
  latitude: number;
  longitude: number;
  endereco: string;
  bairro?: string;
  categoriaIds?: number[];
  infraestruturaIds?: number[];
}

export interface UsuarioResponse {
  id: number;
  nome: string;
  email: string;
  tipo: 'CIDADAO' | 'ORGANIZADOR' | 'GESTOR_PUBLICO';
  interesses?: CategoriaResponse[];
}

export interface CategoriaResponse {
  id: number;
  nome: string;
}

export interface InfraestruturaResponse {
  id: number;
  nome: string;
  iconeUrl: string;
}

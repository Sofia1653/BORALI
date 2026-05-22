import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Evento {
  id: number;
  nome: string;
  categoria: string;
  data: string;
  local: string;
  //interessados: number;
  gratuito: boolean;
  preco?: number;
  //distancia: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})

export class Home {
  scrollParaEventos(): void {
    document.getElementById('section-eventos')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  eventos: Evento[] = [
    {
      id: 1,
      nome: 'Sarau da Boa Vista',
      categoria: 'Música',
      data: 'Hoje · 19h',
      local: 'Praça Maciel Pinheiro',
      //interessados: 142,
      gratuito: true,
      //emoji: '🎵',
      //distancia: '1,2 km'
    },

    {
      id: 2,
      nome: 'Teatro do Barroco',
      categoria: 'Teatro',
      data: '04 Jul · 20h',
      local: 'Teatro do Parque',
      //interessados: 89,
      gratuito: false,
      preco: 25,
      //emoji: '🎭',
      //distancia: '2,4 km'
    }
  ];

  filtros = [
    'Todos',
    'Música',
    'Teatro',
    'Arte',
    'Cinema',
    'Dança',
    'Gratuitos'
  ];

  filtroAtivo = 'Todos';
  eventosFiltrados = [...this.eventos];
  filtrarEventos(filtro: string) {
    this.filtroAtivo = filtro;
    if (filtro === 'Todos') {
      this.eventosFiltrados = this.eventos;
      return;
    }

    if (filtro === 'Gratuitos') {
      this.eventosFiltrados = this.eventos.filter(
        evento => evento.gratuito
      );
      return;
    }

    this.eventosFiltrados = this.eventos.filter(
      evento => evento.categoria === filtro
    );
  }
}

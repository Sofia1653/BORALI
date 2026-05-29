import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { AgendaService } from '../../services/agenda.service';

export interface EventoUI {
  id: number;
  nome: string;
  categoria: string;
  data: string;
  local: string;
  gratuito: boolean;
  preco?: number;
  descricao?: string;
  linkExterno?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})

export class Home implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly agendaService = inject(AgendaService);

  readonly usuarioId = 1; // ID do usuário simulado para a agenda
  
  eventos: EventoUI[] = [];
  favoritosIds: Set<number> = new Set<number>();
  eventoSelecionado: EventoUI | null = null;
  toastMessage = '';

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
  eventosFiltrados: EventoUI[] = [];

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    // 1. Carrega favoritos do usuário
    this.agendaService.listarFavoritosUsuario(this.usuarioId).subscribe({
      next: (favoritos) => {
        this.favoritosIds = new Set(favoritos.map(f => f.id));
        // 2. Carrega eventos
        this.carregarEventos();
      },
      error: () => {
        // Se falhar ao listar favoritos (ex: banco zerado), carrega eventos normalmente
        this.carregarEventos();
      }
    });
  }

  carregarEventos(): void {
    this.eventoService.listarTodos().subscribe({
      next: (apiEventos) => {
        this.eventos = apiEventos.map(e => ({
          id: e.id,
          nome: e.nome,
          categoria: e.categorias && e.categorias.length > 0 ? e.categorias[0] : 'Arte',
          data: this.formatDataHora(e.dataHora),
          local: e.bairro ? e.bairro : (e.endereco ? e.endereco : 'Recife'),
          gratuito: e.preco == null || e.preco <= 0,
          preco: e.preco,
          descricao: e.descricao,
          linkExterno: e.linkExterno
        }));
        this.filtrarEventos(this.filtroAtivo);
      },
      error: (err) => {
        console.error('Erro ao carregar eventos do backend:', err);
      }
    });
  }

  formatDataHora(dataHoraStr: string): string {
    try {
      const date = new Date(dataHoraStr);
      const dia = String(date.getDate()).padStart(2, '0');
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const mes = meses[date.getMonth()];
      const horas = String(date.getHours()).padStart(2, '0');
      return `${dia} ${mes} · ${horas}h`;
    } catch (e) {
      return dataHoraStr;
    }
  }

  scrollParaEventos(): void {
    document.getElementById('section-eventos')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

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
      evento => evento.categoria.toLowerCase() === filtro.toLowerCase()
    );
  }

  abrirModal(evento: EventoUI): void {
      this.eventoSelecionado = evento;
      document.body.style.overflow = 'hidden'; // trava o scroll
  }

  fecharModal(): void {
      this.eventoSelecionado = null;
      document.body.style.overflow = '';
  }

  estaFavoritado(eventoId: number): boolean {
    return this.favoritosIds.has(eventoId);
  }

  toggleInteresse(evento: EventoUI): void {
    if (this.estaFavoritado(evento.id)) {
      // Desfavoritar
      this.agendaService.desfavoritar(this.usuarioId, evento.id).subscribe({
        next: () => {
          this.favoritosIds.delete(evento.id);
          this.showToast('Removido do seu planejamento');
        },
        error: () => this.showToast('Erro ao remover da agenda')
      });
    } else {
      // Favoritar
      this.agendaService.favoritar(this.usuarioId, evento.id).subscribe({
        next: () => {
          this.favoritosIds.add(evento.id);
          this.showToast('Adicionado ao seu planejamento!');
        },
        error: () => this.showToast('Erro ao adicionar na agenda')
      });
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}


import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
  private readonly router = inject(Router);

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
        if (apiEventos && apiEventos.length > 0) {
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
        } else {
          this.usarEventosFallback();
        }
        this.filtrarEventos(this.filtroAtivo);
      },
      error: (err) => {
        console.warn('Erro ao carregar eventos do backend. Usando fallback local.', err);
        this.usarEventosFallback();
        this.filtrarEventos(this.filtroAtivo);
      }
    });
  }

  usarEventosFallback(): void {
    this.eventos = [
      {
        id: 1,
        nome: "Festival de Jazz do Recife",
        categoria: "Música",
        data: "12 Jun · 18h",
        local: "Recife Antigo",
        gratuito: true,
        preco: 0,
        descricao: "Um festival incrível com grandes nomes da música instrumental e do jazz, aberto ao público no coração do Recife Antigo."
      },
      {
        id: 2,
        nome: "Teatro Infantil no Parque",
        categoria: "Teatro",
        data: "09 Jun · 16h",
        local: "Jaqueira",
        gratuito: true,
        preco: 0,
        descricao: "Uma tarde mágica de contação de histórias e teatro de fantoches para as crianças no Parque da Jaqueira."
      },
      {
        id: 3,
        nome: "Mostra de Cinema Francês",
        categoria: "Cinema",
        data: "10 Jun · 19h",
        local: "Derby",
        gratuito: false,
        preco: 10,
        descricao: "Exibição especial de clássicos do cinema francês contemporâneo com debates pós-sessão."
      },
      {
        id: 4,
        nome: "Concerto Sinfônico",
        categoria: "Música",
        data: "17 Jun · 20h",
        local: "Santo Antônio",
        gratuito: true,
        preco: 0,
        descricao: "Apresentação da Orquestra Sinfônica do Recife executando a Nona Sinfonia de Beethoven no histórico Teatro de Santa Isabel."
      }
    ];
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

      this.agendaService.desfavoritar(this.usuarioId, evento.id).subscribe({

        next: () => {
          this.favoritosIds.delete(evento.id);

          this.showToast('Removido do seu planejamento');
        },

        error: () => {
          this.showToast('Erro ao remover da agenda');
        }

      });

    } else {

      this.agendaService.favoritar(this.usuarioId, evento.id).subscribe({

        next: () => {

          this.favoritosIds.add(evento.id);

          this.showToast('Adicionado ao seu planejamento!');

          this.fecharModal();

          setTimeout(() => {
            this.router.navigate(['/agenda']);
          }, 800);

        },

        error: () => {
          this.showToast('Erro ao adicionar na agenda');
        }

      });

    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}


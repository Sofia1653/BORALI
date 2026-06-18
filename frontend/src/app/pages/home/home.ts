import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { AgendaService } from '../../services/agenda.service';
import { AuthService } from '../../services/auth.service';

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
  protected readonly authService = inject(AuthService);

  get usuarioId(): number | undefined {
    return this.authService.currentUser()?.id;
  }
  
  eventos: EventoUI[] = [];
  readonly favoritosIds = signal<Set<number>>(new Set<number>());
  eventoSelecionado: EventoUI | null = null;
  readonly toastMessage = signal<string>('');

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
  readonly eventosFiltrados = signal<EventoUI[]>([]);

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    const id = this.usuarioId;
    if (id) {
      // 1. Carrega favoritos do usuário
      this.agendaService.listarFavoritosUsuario(id).subscribe({
        next: (favoritos) => {
          this.favoritosIds.set(new Set(favoritos.map(f => f.id)));
          // 2. Carrega eventos
          this.carregarEventos();
        },
        error: () => {
          // Se falhar ao listar favoritos (ex: banco zerado), carrega eventos normalmente
          this.carregarEventos();
        }
      });
    } else {
      this.favoritosIds.set(new Set<number>());
      this.carregarEventos();
    }
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
      this.eventosFiltrados.set(this.eventos);
      return;
    }

    if (filtro === 'Gratuitos') {
      this.eventosFiltrados.set(this.eventos.filter(
        evento => evento.gratuito
      ));
      return;
    }

    this.eventosFiltrados.set(this.eventos.filter(
      evento => evento.categoria.toLowerCase() === filtro.toLowerCase()
    ));
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
    return this.favoritosIds().has(eventoId);
  }

  toggleInteresse(evento: EventoUI): void {
    const id = this.usuarioId;
    if (!id) {
      this.fecharModal();
      alert('Você precisa fazer login para planejar seus eventos.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.estaFavoritado(evento.id)) {

      this.agendaService.desfavoritar(id, evento.id).subscribe({

        next: () => {
          this.favoritosIds.update(set => {
            set.delete(evento.id);
            return new Set(set);
          });

          this.showToast('Removido do seu planejamento');
        },

        error: () => {
          this.showToast('Erro ao remover da agenda');
        }

      });

    } else {

      this.agendaService.favoritar(id, evento.id).subscribe({

        next: () => {

          this.favoritosIds.update(set => {
            set.add(evento.id);
            return new Set(set);
          });

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
    this.toastMessage.set(message);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}


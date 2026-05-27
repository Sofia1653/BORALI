import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgendaService } from '../../services/agenda.service';

export interface AgendaItem {
  id: number;
  name: string;
  month: string;
  day: string;
  weekday: string;
  date: string;
  location: string;
  tag: string;
  status: 'confirmed' | 'interest';
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agenda.html',
})
export class Agenda implements OnInit {
  private readonly agendaService = inject(AgendaService);

  readonly usuarioId = 1; // ID do usuário padrão
  items: AgendaItem[] = [];
  toastMessage = '';

  ngOnInit(): void {
    this.carregarAgenda();
  }

  carregarAgenda(): void {
    this.agendaService.listarFavoritosUsuario(this.usuarioId).subscribe({
      next: (eventos) => {
        this.items = eventos.map(e => ({
          id: e.id,
          name: e.nome,
          month: this.formatarMes(e.dataHora),
          day: this.formatarDia(e.dataHora),
          weekday: this.formatarDiaSemana(e.dataHora),
          date: e.dataHora,
          location: e.bairro ? e.bairro : (e.endereco ? e.endereco : 'Recife'),
          tag: e.categorias && e.categorias.length > 0 ? e.categorias[0] : 'Arte',
          status: 'interest'
        }));
      },
      error: (err) => {
        console.error('Erro ao carregar favoritos:', err);
      }
    });
  }

  formatarMes(dataHoraStr: string): string {
    try {
      const date = new Date(dataHoraStr);
      const meses = [
        'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
        'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO'
      ];
      return meses[date.getMonth()];
    } catch (e) {
      return 'DIVERSOS';
    }
  }

  formatarDia(dataHoraStr: string): string {
    try {
      const date = new Date(dataHoraStr);
      return String(date.getDate()).padStart(2, '0');
    } catch (e) {
      return '01';
    }
  }

  formatarDiaSemana(dataHoraStr: string): string {
    try {
      const date = new Date(dataHoraStr);
      const dias = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
      return dias[date.getDay()];
    } catch (e) {
      return 'SÁB';
    }
  }

  get months(): string[] {
    return [...new Set(this.items.map(i => i.month))];
  }

  getByMonth(month: string): AgendaItem[] {
    return this.items.filter(i => i.month === month);
  }

  remove(e: MouseEvent, item: AgendaItem) {
    e.stopPropagation();
    this.agendaService.desfavoritar(this.usuarioId, item.id).subscribe({
      next: () => {
        this.items = this.items.filter(i => i.id !== item.id);
        this.showToast('Evento removido da agenda');
      },
      error: () => {
        this.showToast('Erro ao remover da agenda');
      }
    });
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
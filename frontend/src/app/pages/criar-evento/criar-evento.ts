import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoraliService, AgendaItem } from '../../services/borali.service';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda.component.html',
})
export class AgendaComponent {
  svc = inject(BoraliService);
  items: AgendaItem[] = [...this.svc.agendaItems];

  get months(): string[] {
    return [...new Set(this.items.map(i => i.month))];
  }

  getByMonth(month: string): AgendaItem[] {
    return this.items.filter(i => i.month === month);
  }

  remove(e: MouseEvent, item: AgendaItem) {
    e.stopPropagation();
    this.items = this.items.filter(i => i !== item);
    this.svc.showToast('Evento removido da agenda');
  }
}
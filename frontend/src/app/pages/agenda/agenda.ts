import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './agenda.html',
})
export class Agenda {
  items: AgendaItem[] = [];

  get months(): string[] {
    return [...new Set(this.items.map(i => i.month))];
  }

  getByMonth(month: string): AgendaItem[] {
    return this.items.filter(i => i.month === month);
  }

  toastMessage = '';

  remove(e: MouseEvent, item: AgendaItem) {
    e.stopPropagation();
    this.items = this.items.filter(i => i !== item);
    this.showToast('Evento removido da agenda');
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
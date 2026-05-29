import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
})
export class Perfil {
  interestTags = [
    { label: '🎵 Música',        active: true  },
    { label: '🎭 Teatro',        active: true  },
    { label: '🎨 Artes Visuais', active: false },
    { label: '🎬 Cinema',        active: true  },
    { label: '💃 Dança',         active: false },
    { label: '📚 Literatura',    active: false },
    { label: '🍲 Gastronomia',   active: false },
    { label: '🏛️ Patrimônio',   active: false },
  ];

  settings = [
    { title: 'Notificações de Eventos',          desc: 'Avisar quando um evento salvo estiver próximo.', on: true  },
    { title: 'Perfil Público',                   desc: 'Permitir que outros usuários vejam sua agenda.', on: false },
    { title: 'Recomendações por E-mail',         desc: 'Receber curadoria semanal do BORALI.',           on: true  },
    { title: 'Mostrar apenas eventos gratuitos', desc: 'Filtrar automaticamente os eventos sem custo.',  on: false },
  ];

  toastMessage = '';

  toggleInterest(tag: { label: string; active: boolean }) {
    tag.active = !tag.active;
    this.showToast(tag.active ? 'Interesse adicionado!' : 'Interesse removido');
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
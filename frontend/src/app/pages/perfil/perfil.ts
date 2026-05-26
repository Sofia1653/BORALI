import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoraliService } from '../../services/borali.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent {
  svc = inject(BoraliService);

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

  toggleInterest(tag: { label: string; active: boolean }) {
    tag.active = !tag.active;
    this.svc.showToast(tag.active ? 'Interesse adicionado!' : 'Interesse removido');
  }
}

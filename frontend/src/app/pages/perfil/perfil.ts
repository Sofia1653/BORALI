import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../services/evento.service';
import { UsuarioService } from '../../services/usuario.service';

export interface InterestTagUI {
  id: number;
  nome: string;
  label: string;
  active: boolean;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  'Música': '🎵',
  'Teatro': '🎭',
  'Arte': '🎨',
  'Cinema': '🎬',
  'Dança': '💃',
  'Literatura': '📚',
  'Gastronomia': '🍲',
  'Patrimônio': '🏛️'
};

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css']
})
export class Perfil implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly usuarioService = inject(UsuarioService);

  readonly usuarioId = 1; // ID do usuário simulado (Sofia)
  interestTags: InterestTagUI[] = [];

  settings = [
    { title: 'Notificações de Eventos',          desc: 'Avisar quando um evento salvo estiver próximo.', on: true  },
    { title: 'Perfil Público',                   desc: 'Permitir que outros usuários vejam sua agenda.', on: false },
    { title: 'Recomendações por E-mail',         desc: 'Receber curadoria semanal do BORALI.',           on: true  },
    { title: 'Mostrar apenas eventos gratuitos', desc: 'Filtrar automaticamente os eventos sem custo.',  on: false },
  ];

  toastMessage = '';

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.eventoService.listarCategorias().subscribe({
      next: (cats) => {
        this.usuarioService.buscarUsuarioPorId(this.usuarioId).subscribe({
          next: (user) => {
            const userInteressesIds = new Set((user.interesses || []).map(i => i.id));
            this.interestTags = cats.map(cat => {
              const emoji = CATEGORY_EMOJIS[cat.nome] || '🏷️';
              return {
                id: cat.id,
                nome: cat.nome,
                label: `${emoji} ${cat.nome}`,
                active: userInteressesIds.has(cat.id)
              };
            });
          },
          error: (err) => {
            console.error('Erro ao carregar usuário:', err);
            // Fallback se o usuário não for encontrado no banco ainda
            this.interestTags = cats.map(cat => {
              const emoji = CATEGORY_EMOJIS[cat.nome] || '🏷️';
              return {
                id: cat.id,
                nome: cat.nome,
                label: `${emoji} ${cat.nome}`,
                active: false
              };
            });
          }
        });
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
      }
    });
  }

  toggleInterest(tag: InterestTagUI) {
    if (tag.active) {
      this.usuarioService.removerInteresse(this.usuarioId, tag.id).subscribe({
        next: () => {
          tag.active = false;
          this.showToast('Interesse removido');
        },
        error: () => {
          this.showToast('Erro ao remover interesse');
        }
      });
    } else {
      this.usuarioService.adicionarInteresse(this.usuarioId, tag.id).subscribe({
        next: () => {
          tag.active = true;
          this.showToast('Interesse adicionado!');
        },
        error: () => {
          this.showToast('Erro ao adicionar interesse');
        }
      });
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
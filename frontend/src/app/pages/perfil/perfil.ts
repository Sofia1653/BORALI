import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

export interface InterestTagUI {
  id?: number;
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
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  get usuarioId(): number {
    return this.authService.currentUser()?.id ?? 0;
  }

  get currentUser() {
    return this.authService.currentUser();
  }
  
  // Lista inicial com fallbacks locais de emojis caso a API falhe ou retorne vazia
  readonly interestTags = signal<InterestTagUI[]>([
    { id: 1, nome: 'Música',        label: '🎵 Música',        active: true  },
    { id: 2, nome: 'Teatro',        label: '🎭 Teatro',        active: true  },
    { id: 3, nome: 'Arte',          label: '🎨 Arte',          active: false },
    { id: 4, nome: 'Cinema',        label: '🎬 Cinema',        active: true  },
    { id: 5, nome: 'Dança',         label: '💃 Dança',         active: false },
    { label: '📚 Literatura',    nome: 'Literatura',    active: false },
    { label: '🍲 Gastronomia',   nome: 'Gastronomia',   active: false },
    { label: '🏛️ Patrimônio',   nome: 'Patrimônio',   active: false }
  ]);

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
        if (cats && cats.length > 0) {
          this.usuarioService.buscarUsuarioPorId(this.usuarioId).subscribe({
            next: (user) => {
              const userInteressesIds = new Set((user.interesses || []).map(i => i.id));
              this.interestTags.set(cats.map(cat => {
                const emoji = CATEGORY_EMOJIS[cat.nome] || '🏷️';
                return {
                  id: cat.id,
                  nome: cat.nome,
                  label: `${emoji} ${cat.nome}`,
                  active: userInteressesIds.has(cat.id)
                };
              }));
            },
            error: (err) => {
              console.warn('Erro ao carregar usuário do backend. Usando categorias do banco com status inativo:', err);
              this.interestTags.set(cats.map(cat => {
                const emoji = CATEGORY_EMOJIS[cat.nome] || '🏷️';
                return {
                  id: cat.id,
                  nome: cat.nome,
                  label: `${emoji} ${cat.nome}`,
                  active: false
                };
              }));
            }
          });
        }
      },
      error: (err) => {
        console.warn('Erro ao carregar categorias do backend. Mantendo tags locais de fallback.', err);
      }
    });
  }

  toggleInterest(tag: InterestTagUI) {
    if (!tag.id) {
      // Toggle local caso não esteja sincronizado com ID do backend
      tag.active = !tag.active;
      this.interestTags.update(tags => [...tags]);
      this.showToast(tag.active ? 'Interesse adicionado!' : 'Interesse removido');
      return;
    }

    if (tag.active) {
      this.usuarioService.removerInteresse(this.usuarioId, tag.id).subscribe({
        next: () => {
          tag.active = false;
          this.interestTags.update(tags => [...tags]);
          this.showToast('Interesse removido');
        },
        error: (err) => {
          console.warn('Erro ao desfavoritar no servidor, fazendo toggle local', err);
          tag.active = false;
          this.interestTags.update(tags => [...tags]);
          this.showToast('Interesse removido (local)');
        }
      });
    } else {
      this.usuarioService.adicionarInteresse(this.usuarioId, tag.id).subscribe({
        next: () => {
          tag.active = true;
          this.interestTags.update(tags => [...tags]);
          this.showToast('Interesse adicionado!');
        },
        error: (err) => {
          console.warn('Erro ao favoritar no servidor, fazendo toggle local', err);
          tag.active = true;
          this.interestTags.update(tags => [...tags]);
          this.showToast('Interesse adicionado (local)!');
        }
      });
    }
  }

  showToast(message: string) {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
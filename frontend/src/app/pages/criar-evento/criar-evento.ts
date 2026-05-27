import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { CategoriaResponse, EventoRequest } from '../../models/models';

@Component({
  selector: 'app-criar-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './criar-evento.html',
  styleUrl: './criar-evento.css'
})
export class CriarEvento implements OnInit {
  private readonly eventoService = inject(EventoService);
  private readonly router = inject(Router);

  readonly organizadorId = 1; // ID do organizador padrão (Sofia)
  categorias: CategoriaResponse[] = [];
  toastMessage = '';
  isSubmitting = false;

  evento = {
    nome: '',
    descricao: '',
    dataHora: '',
    preco: null as number | null,
    linkExterno: '',
    endereco: '',
    bairro: '',
    latitude: -8.0578,
    longitude: -34.8829,
    categoriaIds: [] as number[]
  };

  ngOnInit(): void {
    this.carregarCategorias();
    
    // Define a data padrão para amanhã neste mesmo horário
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setMinutes(0);
    amanha.setSeconds(0);
    this.evento.dataHora = amanha.toISOString().slice(0, 16);
  }

  carregarCategorias(): void {
    this.eventoService.listarCategorias().subscribe({
      next: (cats) => {
        this.categorias = cats;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias do backend:', err);
      }
    });
  }

  toggleCategoria(catId: number): void {
    const idx = this.evento.categoriaIds.indexOf(catId);
    if (idx > -1) {
      this.evento.categoriaIds.splice(idx, 1);
    } else {
      this.evento.categoriaIds.push(catId);
    }
  }

  isCategoriaSelected(catId: number): boolean {
    return this.evento.categoriaIds.includes(catId);
  }

  submeterForm(): void {
    if (!this.evento.nome || !this.evento.dataHora || !this.evento.endereco) {
      this.showToast('Por favor, preencha os campos obrigatórios!');
      return;
    }

    if (this.evento.categoriaIds.length === 0) {
      this.showToast('Selecione ao menos uma categoria para o evento!');
      return;
    }

    this.isSubmitting = true;

    const request: EventoRequest = {
      nome: this.evento.nome,
      descricao: this.evento.descricao,
      dataHora: this.evento.dataHora,
      preco: this.evento.preco === null ? 0.0 : this.evento.preco,
      linkExterno: this.evento.linkExterno || undefined,
      organizadorId: this.organizadorId,
      latitude: this.evento.latitude,
      longitude: this.evento.longitude,
      endereco: this.evento.endereco,
      bairro: this.evento.bairro || undefined,
      categoriaIds: this.evento.categoriaIds,
      infraestruturaIds: [] // Sem infraestruturas por enquanto
    };

    this.eventoService.criar(request).subscribe({
      next: (res) => {
        this.showToast('Evento cultural criado com sucesso!');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        console.error('Erro ao criar evento:', err);
        this.showToast('Erro ao criar evento. Verifique os dados!');
        this.isSubmitting = false;
      }
    });
  }

  showToast(message: string): void {
    this.toastMessage = message;
    setTimeout(() => this.toastMessage = '', 3000);
  }
}
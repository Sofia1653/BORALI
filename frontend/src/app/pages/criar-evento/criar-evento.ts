import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs';
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
  private readonly http = inject(HttpClient);

  readonly organizadorId = 1;
  categorias: CategoriaResponse[] = [];
  toastMessage = '';
  isSubmitting = false;
  geocodingStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  enderecoResolvido = '';

  evento = {
    nome: '',
    descricao: '',
    dataHora: '',
    preco: null as number | null,
    linkExterno: '',
    endereco: '',
    bairro: '',
    latitude: null as number | null,
    longitude: null as number | null,
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

  onEnderecoChange(): void {
    if (this.geocodingStatus === 'success') {
      this.geocodingStatus = 'idle';
      this.evento.latitude = null;
      this.evento.longitude = null;
      this.enderecoResolvido = '';
    }
  }

  buscarLocalizacao(): void {
    if (!this.evento.endereco.trim()) {
      this.showToast('Digite um endereço para buscar a localização.');
      return;
    }

    this.geocodingStatus = 'loading';

    const query = [this.evento.endereco, this.evento.bairro, 'Recife', 'Pernambuco', 'Brasil']
      .filter(Boolean)
      .join(', ');

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1&countrycodes=br`;
    const headers = new HttpHeaders({ 'Accept-Language': 'pt-BR' });

    this.http.get<NominatimResult[]>(url, { headers }).pipe(timeout(8000)).subscribe({
      next: (results) => {
        if (results && results.length > 0) {
          this.evento.latitude = parseFloat(results[0].lat);
          this.evento.longitude = parseFloat(results[0].lon);
          this.enderecoResolvido = results[0].display_name;
          this.geocodingStatus = 'success';
        } else {
          this.geocodingStatus = 'error';
          this.showToast('Endereço não encontrado. Tente ser mais específico.');
        }
      },
      error: () => {
        this.geocodingStatus = 'error';
        this.showToast('Erro ao buscar localização. Tente novamente.');
      }
    });
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

    if (this.evento.latitude === null || this.evento.longitude === null) {
      this.showToast('Use o botão "Buscar Localização" para confirmar o endereço no mapa.');
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
      latitude: this.evento.latitude as number,
      longitude: this.evento.longitude as number,
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

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}
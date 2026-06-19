import { Component, OnInit, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento.service';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa.html',
  styleUrls: ['./mapa.css']
})
export class Mapa implements OnInit, AfterViewInit {
  private readonly eventoService = inject(EventoService);
  private readonly platformId = inject(PLATFORM_ID);

  private map: any;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  private async initMap(): Promise<void> {
    // Dynamic import to prevent SSR (Server-Side Rendering) build errors
    const leafletModule = await import('leaflet');
    const L = (leafletModule as any).default ?? leafletModule;

    // Centraliza o mapa em Recife
    this.map = L.map('map', {
      center: [-8.0578, -34.8829],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Carrega os eventos do backend e plota no mapa
    this.eventoService.listarTodos().subscribe({
      next: (eventos) => {
        eventos.forEach(ev => {
          if (ev.latitude && ev.longitude) {
            const popupContent = `
              <div class="popup-title">${ev.nome}</div>
              <div class="popup-info"><strong>Categoria:</strong> ${ev.categorias && ev.categorias.length > 0 ? ev.categorias[0] : 'Cultura'}</div>
              <div class="popup-info"><strong>Data:</strong> ${this.formatDataHora(ev.dataHora)}</div>
              <div class="popup-info"><strong>Preço:</strong> ${ev.preco && ev.preco > 0 ? 'R$ ' + ev.preco.toFixed(2) : 'Gratuito'}</div>
              <div class="popup-info"><strong>Endereço:</strong> ${ev.bairro ? ev.bairro : ev.endereco}</div>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${ev.latitude},${ev.longitude}" target="_blank" class="btn-popup-route">
                Como Chegar
              </a>
            `;

            // Utiliza o marcador padrão do Leaflet hospedado em CDN pública
            // para evitar erros de caminhos de assets locais no empacotamento do Angular
            const customIcon = L.icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            });

            L.marker([ev.latitude, ev.longitude], { icon: customIcon })
              .addTo(this.map)
              .bindPopup(popupContent);
          }
        });
      },
      error: (err) => {
        console.error('Erro ao carregar eventos para o mapa:', err);
      }
    });
  }

  private formatDataHora(dataHoraStr: string): string {
    try {
      const date = new Date(dataHoraStr);
      const dia = String(date.getDate()).padStart(2, '0');
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const mes = meses[date.getMonth()];
      const horas = String(date.getHours()).padStart(2, '0');
      const minutos = String(date.getMinutes()).padStart(2, '0');
      return `${dia} de ${mes} às ${horas}:${minutos}h`;
    } catch (e) {
      return dataHoraStr;
    }
  }
}

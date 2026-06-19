import {
  Component, OnInit, AfterViewInit, OnDestroy,
  PLATFORM_ID, inject, ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface SurveyRecord {
  id: number;
  faixa_etaria: string;
  bairro: string;
  frequencia_eventos: string;
  tipos_eventos: string | null;
  canais_descoberta: string | null;
  facilidade_descoberta: string | null;
  perdeu_evento_tarde: boolean | null;
  usaria_app_localizacao: string | null;
  funcionalidades_uteis: string | null;
}

const BAIRRO_COORDS: Record<string, [number, number]> = {
  'boa viagem':              [-8.1183, -34.9001],
  'ibura':                   [-8.1298, -34.9404],
  'jardim sao paulo':        [-7.9870, -34.8734],
  'gracas':                  [-8.0456, -34.9060],
  'moreno':                  [-8.1172, -35.0906],
  'candeias':                [-8.2813, -35.0697],
  'jaboatao dos guararapes': [-8.1819, -35.0026],
  'piedade':                 [-8.2045, -35.0053],
  'campo grande':            [-8.0621, -34.9149],
  'zona norte':              [-7.9550, -34.8950],
  'prazeres':                [-8.2236, -35.0217],
  'recife':                  [-8.0578, -34.8829],
  'casa amarela':            [-8.0224, -34.9155],
  'apipucos':                [-8.0297, -34.9200],
  'barro':                   [-8.1547, -34.9530],
  'olinda':                  [-7.9986, -34.8440],
  'encruzilhada':            [-8.0280, -34.9090],
  'tejipio':                 [-8.0964, -34.9625],
  'casa forte':              [-8.0317, -34.9201],
  'rosarinho':               [-8.0365, -34.9143],
  'espinheiro':              [-8.0490, -34.9062],
  'zona sul':                [-8.1300, -34.9200],
  'paulista':                [-7.9396, -34.8793],
  'boa vista':               [-8.0628, -34.8749],
  'cabo de santo agostinho': [-8.2887, -35.0348],
};

const BAIRRO_DISPLAY: Record<string, string> = {
  'boa viagem': 'Boa Viagem', 'ibura': 'Ibura',
  'jardim sao paulo': 'Jardim São Paulo', 'gracas': 'Graças',
  'moreno': 'Moreno', 'candeias': 'Candeias',
  'jaboatao dos guararapes': 'Jaboatão dos Guararapes',
  'piedade': 'Piedade', 'campo grande': 'Campo Grande',
  'zona norte': 'Zona Norte', 'prazeres': 'Prazeres',
  'recife': 'Recife', 'casa amarela': 'Casa Amarela',
  'apipucos': 'Apipucos', 'barro': 'Barro', 'olinda': 'Olinda',
  'encruzilhada': 'Encruzilhada', 'tejipio': 'Tejipió',
  'casa forte': 'Casa Forte', 'rosarinho': 'Rosarinho',
  'espinheiro': 'Espinheiro', 'zona sul': 'Zona Sul',
  'paulista': 'Paulista', 'boa vista': 'Boa Vista',
  'cabo de santo agostinho': 'Cabo de Santo Agostinho',
};

function normalizeBairro(raw: string): string | null {
  if (!raw) return null;
  const s = raw
    .toLowerCase()
    .normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/[()]/g, '')
    .split(/[/,;]/)[0]
    .trim();
  for (const key of Object.keys(BAIRRO_COORDS)) {
    if (s.includes(key)) return key;
  }
  return null;
}

function heatColor(intensity: number): string {
  if (intensity > 0.65) return '#ef4444';
  if (intensity > 0.35) return '#f59e0b';
  return '#22d3ee';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);

  allData: SurveyRecord[] = [];
  filteredData: SurveyRecord[] = [];
  selectedFaixa = '';
  readonly faixas = ['16-24', '25-39', '40-59', '60+'];
  isLoading = true;

  kpiTotal = 0;
  kpiBairros = 0;
  kpiPerderamPct = 0;
  kpiCanalPrincipal = '';
  kpiUsariaApp = 0;

  private map: any;
  private heatGroup: any;
  private charts: Record<string, any> = {};
  private Chart: any;

  readonly FREQ_ORDER = ['Muito frequentemente', 'Frequentemente', 'Às vezes', 'Raramente', 'Nunca'];
  readonly DIFF_COLORS: Record<string, string> = {
    'Muito fácil': '#10b981', 'Fácil': '#84cc16',
    'Neutro': '#C8A96E', 'Difícil': '#f97316', 'Muito difícil': '#ef4444',
  };
  private readonly PALETTE = ['#E8431A', '#C8A96E', '#22d3ee', '#8b5cf6', '#10b981', '#f59e0b'];
  private readonly TIP = {
    backgroundColor: '#1E1E1C', titleColor: '#F5F3EE',
    bodyColor: '#8A8880', borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1, padding: 10,
  };

  ngOnInit(): void {
    this.http.get<SurveyRecord[]>('/survey-data.json').subscribe({
      next: data => {
        this.allData = data;
        this.isLoading = false;
        this.applyFilter();
      },
      error: () => { this.isLoading = false; }
    });
  }

  ngAfterViewInit(): void {
    // Map div is inside @if(!isLoading) — not in DOM yet, init happens in applyFilter
  }

  ngOnDestroy(): void {
    Object.values(this.charts).forEach((c: any) => c?.destroy?.());
    this.map?.remove();
  }

  setFaixa(f: string): void {
    this.selectedFaixa = f;
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredData = this.selectedFaixa
      ? this.allData.filter(r => r.faixa_etaria === this.selectedFaixa)
      : [...this.allData];
    this.computeKPIs();
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(async () => {
        if (!this.map) await this.initMap();
        else await this.updateHeatmap();
        this.renderAll();
      }, 80);
    }
  }

  private computeKPIs(): void {
    const d = this.filteredData;
    this.kpiTotal = d.length;
    this.kpiBairros = new Set(d.map(r => normalizeBairro(r.bairro)).filter(Boolean)).size;
    const perderam = d.filter(r => r.perdeu_evento_tarde === true).length;
    this.kpiPerderamPct = d.length ? Math.round(perderam / d.length * 100) : 0;
    const usaria = d.filter(r => r.usaria_app_localizacao?.toLowerCase().includes('sim')).length;
    this.kpiUsariaApp = d.length ? Math.round(usaria / d.length * 100) : 0;
    const cc: Record<string, number> = {};
    d.forEach(r => (r.canais_descoberta || '').split(';').forEach(c => {
      const k = c.trim(); if (k) cc[k] = (cc[k] || 0) + 1;
    }));
    const top = Object.entries(cc).sort((a, b) => b[1] - a[1])[0];
    this.kpiCanalPrincipal = top ? top[0].split('/')[0].trim() : '-';
  }

  private async renderAll(): Promise<void> {
    if (!this.Chart) {
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);
      Chart.defaults.color = '#8A8880';
      Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
      this.Chart = Chart;
    }
    this.renderBar('tiposChart',  'tipos_eventos',       ';', '#E8431A');
    this.renderBar('canaisChart', 'canais_descoberta',   ';', '#C8A96E');
    this.renderBar('funcsChart',  'funcionalidades_uteis',';', '#22d3ee');
    this.renderDonut('ageChart',  'faixa_etaria');
    this.renderFreq();
    this.renderDifficulty();
    this.updateHeatmap();
  }

  private splitCount(field: keyof SurveyRecord, sep?: string): [string, number][] {
    const m: Record<string, number> = {};
    this.filteredData.forEach(r => {
      const v = (r[field] as string) || '';
      (sep ? v.split(sep) : [v]).forEach(x => {
        const k = x.trim();
        if (k && !k.startsWith('Não costumo')) m[k] = (m[k] || 0) + 1;
      });
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }

  private make(id: string, config: any): void {
    this.charts[id]?.destroy();
    const el = document.getElementById(id) as HTMLCanvasElement;
    if (el && this.Chart) this.charts[id] = new this.Chart(el, config);
  }

  private renderBar(id: string, field: keyof SurveyRecord, sep: string, color: string): void {
    const entries = this.splitCount(field, sep);
    this.make(id, {
      type: 'bar',
      data: {
        labels: entries.map(([k]) => k.length > 40 ? k.slice(0, 38) + '…' : k),
        datasets: [{
          data: entries.map(([, v]) => v),
          backgroundColor: color + 'BB',
          borderColor: color,
          borderWidth: 1,
          borderRadius: 4,
        }],
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: this.TIP },
        scales: {
          x: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { font: { size: 12 } }, grid: { display: false } },
        },
      },
    });
  }

  private renderDonut(id: string, field: keyof SurveyRecord): void {
    const entries = this.splitCount(field);
    this.make(id, {
      type: 'doughnut',
      data: {
        labels: entries.map(([k]) => k),
        datasets: [{ data: entries.map(([, v]) => v), backgroundColor: this.PALETTE, borderColor: '#141413', borderWidth: 3 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#F5F3EE', font: { size: 12 }, padding: 14, boxWidth: 12, boxHeight: 12 } },
          tooltip: this.TIP,
        },
      },
    });
  }

  private renderFreq(): void {
    const m: Record<string, number> = {};
    this.filteredData.forEach(r => { if (r.frequencia_eventos) m[r.frequencia_eventos] = (m[r.frequencia_eventos] || 0) + 1; });
    const labels = this.FREQ_ORDER.filter(o => m[o]);
    this.make('freqChart', {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{ data: labels.map(l => m[l]), backgroundColor: this.PALETTE, borderColor: '#141413', borderWidth: 3 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#F5F3EE', font: { size: 12 }, padding: 14, boxWidth: 12, boxHeight: 12 } },
          tooltip: this.TIP,
        },
      },
    });
  }

  private renderDifficulty(): void {
    const m: Record<string, number> = {};
    this.filteredData.forEach(r => { if (r.facilidade_descoberta) m[r.facilidade_descoberta] = (m[r.facilidade_descoberta] || 0) + 1; });
    const labels = Object.keys(this.DIFF_COLORS).filter(o => m[o]);
    this.make('difficultyChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [{ data: labels.map(l => m[l]), backgroundColor: labels.map(l => this.DIFF_COLORS[l]), borderColor: 'transparent', borderRadius: 6 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: this.TIP },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { ticks: { font: { size: 12 } }, grid: { display: false } },
        },
      },
    });
  }

  private async initMap(): Promise<void> {
    const leafletModule = await import('leaflet');
    const L = (leafletModule as any).default ?? leafletModule;
    this.map = L.map('heatmap', { center: [-8.09, -34.95], zoom: 10 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);

    // Dark invert filter to match dashboard theme
    setTimeout(() => {
      const pane = this.map.getPane('tilePane') as HTMLElement | undefined;
      if (pane) pane.style.filter = 'invert(1) hue-rotate(180deg) brightness(0.75) saturate(0.5)';
    }, 200);

    const LegendControl = L.Control.extend({
      options: { position: 'bottomright' },
      onAdd() {
        const d = L.DomUtil.create('div', 'heat-legend');
        d.innerHTML = `
          <div class="lg-title">DEMANDA</div>
          <div class="lg-item"><i style="background:#ef4444"></i>Alta (4–5 resp.)</div>
          <div class="lg-item"><i style="background:#f59e0b"></i>Média (2–3 resp.)</div>
          <div class="lg-item"><i style="background:#22d3ee"></i>Baixa (1 resp.)</div>`;
        return d;
      }
    });
    new LegendControl().addTo(this.map);

    if (this.filteredData.length) await this.updateHeatmap();
  }

  private async updateHeatmap(): Promise<void> {
    if (!this.map) return;
    const leafletModule = await import('leaflet');
    const L = (leafletModule as any).default ?? leafletModule;
    if (this.heatGroup) { this.map.removeLayer(this.heatGroup); }

    const counts: Record<string, number> = {};
    this.filteredData.forEach(r => {
      const k = normalizeBairro(r.bairro);
      if (k) counts[k] = (counts[k] || 0) + 1;
    });

    const max = Math.max(...Object.values(counts), 1);
    const group = L.layerGroup();

    Object.entries(counts).forEach(([key, n]) => {
      const c = BAIRRO_COORDS[key];
      if (!c) return;
      const col = heatColor(n / max);
      const name = BAIRRO_DISPLAY[key] || key;

      L.circle(c, { radius: 4500 + n * 1400, color: 'none', fillColor: col, fillOpacity: 0.07 }).addTo(group);
      L.circle(c, { radius: 2500 + n * 800,  color: 'none', fillColor: col, fillOpacity: 0.18 }).addTo(group);
      L.circle(c, { radius: 1000 + n * 350,  color: col, weight: 1.5, fillColor: col, fillOpacity: 0.72 })
        .addTo(group)
        .bindPopup(`<div class="pop"><strong>${name}</strong><br><span>${n} respondente${n !== 1 ? 's' : ''}</span></div>`);
    });

    group.addTo(this.map);
    this.heatGroup = group;
  }
}

import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'agenda',
    renderMode: RenderMode.Client
  },
  {
    path: 'criar-evento',
    renderMode: RenderMode.Client
  },
  {
    path: 'mapa',
    renderMode: RenderMode.Client
  },
  {
    path: 'perfil',
    renderMode: RenderMode.Client
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

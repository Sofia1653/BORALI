import { Routes } from '@angular/router';

import { Agenda } from './pages/agenda/agenda';
import { CriarEvento } from './pages/criar-evento/criar-evento';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Mapa } from './pages/mapa/mapa';
import { Perfil } from './pages/perfil/perfil';
import { authGuard, roleGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'agenda', component: Agenda, canActivate: [authGuard] },
    { path: 'criar-evento', component: CriarEvento, canActivate: [authGuard, roleGuard(['ORGANIZADOR', 'GESTOR_PUBLICO'])] },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard, roleGuard(['ORGANIZADOR', 'GESTOR_PUBLICO'])] },
    { path: 'login', component: Login },
    { path: 'mapa', component: Mapa, canActivate: [authGuard] },
    { path: 'perfil', component: Perfil, canActivate: [authGuard] }
];

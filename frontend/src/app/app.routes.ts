import { Routes } from '@angular/router';

import { Agenda } from './pages/agenda/agenda';
import { CriarEvento } from './pages/criar-evento/criar-evento';
import { Dashboard } from './pages/dashboard/dashboard';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Mapa } from './pages/mapa/mapa';
import { Perfil } from './pages/perfil/perfil';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'agenda', component: Agenda },
    { path: 'criar-evento', component: CriarEvento },
    { path: 'dashboard', component: Dashboard },
    { path: 'login', component: Login },
    { path: 'mapa', component: Mapa },
    { path: 'perfil', component: Perfil }
];

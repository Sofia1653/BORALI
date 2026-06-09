import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isOrganizerOrManager(): boolean {
    const role = this.authService.currentUser()?.tipo;
    return role === 'ORGANIZADOR' || role === 'GESTOR_PUBLICO';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  showLockAlert(event: Event, type: 'geral' | 'organizador' = 'geral') {
    event.preventDefault();
    if (type === 'organizador' && this.isLoggedIn()) {
      alert('Acesso restrito: Esta página é exclusiva para Organizadores ou Gestores Públicos.');
    } else {
      alert('Você precisa criar uma conta ou fazer login para acessar esta página.');
      this.router.navigate(['/login']);
    }
  }
}

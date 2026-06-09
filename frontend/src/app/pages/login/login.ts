import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isRegisterMode = false;
  
  // Form fields
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  tipo: 'CIDADAO' | 'ORGANIZADOR' | 'GESTOR_PUBLICO' = 'CIDADAO';

  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const mode = params['mode'];
      if (mode === 'cadastro' || mode === 'register') {
        this.isRegisterMode = true;
      } else {
        this.isRegisterMode = false;
      }

      const role = params['role'];
      if (role === 'ORGANIZADOR' || role === 'GESTOR_PUBLICO' || role === 'CIDADAO') {
        this.tipo = role;
      }
    });
  }

  toggleMode(register: boolean) {
    this.isRegisterMode = register;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isRegisterMode) {
      if (!this.nome || !this.email || !this.senha || !this.tipo) {
        this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
        return;
      }
      if (this.senha !== this.confirmarSenha) {
        this.errorMessage = 'As senhas informadas não coincidem.';
        return;
      }

      this.authService.register(this.nome, this.email, this.senha, this.tipo).subscribe({
        next: (user) => {
          this.successMessage = 'Conta criada com sucesso!';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err?.error?.message || 'Erro ao criar conta. Tente outro e-mail.';
        }
      });
    } else {
      if (!this.email || !this.senha) {
        this.errorMessage = 'Por favor, preencha o e-mail e a senha.';
        return;
      }

      this.authService.login(this.email, this.senha).subscribe({
        next: (user) => {
          this.successMessage = 'Acesso liberado!';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1000);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err?.error?.message || 'E-mail ou senha incorretos.';
        }
      });
    }
  }
}

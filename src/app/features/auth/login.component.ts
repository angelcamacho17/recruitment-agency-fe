import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4">
      <div class="max-w-md w-full">
        <!-- Logo/Header -->
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p class="text-gray-400">Victoria Poggioli</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Acceso Seguro</h2>

          <form (ngSubmit)="handleLogin()" class="space-y-6">
            <!-- Token Input -->
            <div>
              <label for="token" class="block text-sm font-medium text-gray-700 mb-2">
                Token de Acceso
              </label>
              <input
                type="password"
                id="token"
                [(ngModel)]="token"
                name="token"
                placeholder="Ingresa tu token de acceso"
                [disabled]="loading()"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <!-- Error Message -->
            <div *ngIf="error()" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-sm text-red-800 flex items-center gap-2">
                <span>❌</span>
                {{ error() }}
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              [disabled]="loading() || !token.trim()"
              class="w-full bg-black text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span *ngIf="loading()" class="animate-spin">⏳</span>
              <span>{{ loading() ? 'Verificando...' : 'Ingresar' }}</span>
            </button>
          </form>

          <!-- Info -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <p class="text-xs text-gray-500 text-center">
              🔒 Este panel está protegido. Necesitas un token válido para acceder.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-6">
          <p class="text-sm text-gray-500">
            Panel de Administración © 2024
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  token = '';
  loading = signal(false);
  error = signal<string | null>(null);

  handleLogin(): void {
    if (!this.token.trim()) {
      this.error.set('Por favor ingresa un token');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Simular un pequeño delay para UX
    setTimeout(() => {
      const success = this.authService.login(this.token);

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Token inválido. Por favor verifica e intenta nuevamente.');
        this.token = '';
      }

      this.loading.set(false);
    }, 500);
  }
}

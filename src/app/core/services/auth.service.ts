import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'admin_authenticated';
  private readonly TOKEN_KEY = 'admin_token';

  isAuthenticated = signal<boolean>(this.checkAuthentication());

  constructor(private router: Router) {}

  /**
   * Verifica si el usuario está autenticado al cargar la app
   */
  private checkAuthentication(): boolean {
    const isAuth = localStorage.getItem(this.STORAGE_KEY) === 'true';
    const storedToken = localStorage.getItem(this.TOKEN_KEY);

    // Verificar que el token almacenado coincida con el del ambiente
    if (isAuth && storedToken === environment.adminToken) {
      return true;
    }

    // Si no coincide, limpiar el storage
    this.clearAuth();
    return false;
  }

  /**
   * Intenta autenticar con el token proporcionado
   */
  login(token: string): boolean {
    if (token === environment.adminToken) {
      localStorage.setItem(this.STORAGE_KEY, 'true');
      localStorage.setItem(this.TOKEN_KEY, token);
      this.isAuthenticated.set(true);
      return true;
    }
    return false;
  }

  /**
   * Cierra la sesión y limpia el storage
   */
  logout(): void {
    this.clearAuth();
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Limpia los datos de autenticación del localStorage
   */
  private clearAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

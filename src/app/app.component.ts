import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar.component';
import { SidebarComponent } from './shared/components/sidebar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <!-- Login page (no navbar/sidebar) -->
    <div *ngIf="isLoginPage()" style="height: 100vh;">
      <router-outlet></router-outlet>
    </div>

    <!-- Admin pages (with navbar/sidebar) -->
    <div *ngIf="!isLoginPage()" class="flex flex-col bg-gray-50" style="height: 100vh;">
      <app-navbar></app-navbar>
      <div class="flex flex-1 overflow-hidden" style="height: 100%;">
        <app-sidebar></app-sidebar>
        <main class="flex-1 overflow-y-auto" style="height: 100%;">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'whatsapp-dashboard';
  currentUrl = signal<string>('');

  constructor(private router: Router) {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.url);
    });

    // Set initial URL
    this.currentUrl.set(this.router.url);
  }

  isLoginPage(): boolean {
    return this.currentUrl().startsWith('/login');
  }
}

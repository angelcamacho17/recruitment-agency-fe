import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Mobile menu button -->
    <button
      (click)="toggleMenu()"
      class="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-black text-white"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path *ngIf="!isOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        <path *ngIf="isOpen()" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <!-- Overlay for mobile -->
    <div
      *ngIf="isOpen()"
      (click)="toggleMenu()"
      class="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
    ></div>

    <!-- Sidebar -->
    <aside [class]="'bg-gradient-to-b from-gray-900 to-black text-white w-72 flex-shrink-0 overflow-y-auto transition-transform duration-300 ' +
                    'md:translate-x-0 md:relative fixed inset-y-0 left-0 z-40 ' +
                    (isOpen() ? 'translate-x-0' : '-translate-x-full')">
      <nav class="p-6 space-y-3" style="height: 100vh;">
        <!-- Home -->
        <a
          routerLink="/"
          routerLinkActive="bg-primary-600 shadow-xl"
          [routerLinkActiveOptions]="{exact: true}"
          (click)="closeMenu()"
          class="flex items-center space-x-3 px-5 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 group"
        >
          <span class="text-2xl">🏠</span>
          <span class="font-semibold text-lg">Centro de Agentes</span>
        </a>

        <div class="border-t border-gray-700 my-4"></div>

        <!-- AI Agents Section -->
        <div class="space-y-2">
          <h3 class="text-xs font-bold uppercase text-gray-400 px-5 mb-3">Agentes IA</h3>

          <!-- CV Scout -->
          <a
            routerLink="/cv-analysis"
            routerLinkActive="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl scale-105"
            (click)="closeMenu()"
            class="flex items-center space-x-3 px-5 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 group"
          >
            <span class="text-2xl">🎯</span>
            <div class="flex-1">
              <div class="font-semibold">CV Scout</div>
              <div class="text-xs text-gray-400">Análisis de CVs</div>
            </div>
          </a>

          <!-- Content Genius -->
          <a
            routerLink="/content-generator"
            routerLinkActive="bg-gradient-to-r from-purple-600 to-purple-700 shadow-xl scale-105"
            (click)="closeMenu()"
            class="flex items-center space-x-3 px-5 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 group"
          >
            <span class="text-2xl">✨</span>
            <div class="flex-1">
              <div class="font-semibold">Content Genius</div>
              <div class="text-xs text-gray-400">Generador de Contenido</div>
            </div>
          </a>

          <!-- Talent Matcher -->
          <a
            routerLink="/talent-matching"
            routerLinkActive="bg-gradient-to-r from-green-600 to-green-700 shadow-xl scale-105"
            (click)="closeMenu()"
            class="flex items-center space-x-3 px-5 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 group"
          >
            <span class="text-2xl">🤝</span>
            <div class="flex-1">
              <div class="font-semibold">Talent Matcher</div>
              <div class="text-xs text-gray-400">Matching Inteligente</div>
            </div>
          </a>
        </div>

        <div class="border-t border-gray-700 my-4"></div>

        <!-- Management Section -->
        <div class="space-y-2">
          <h3 class="text-xs font-bold uppercase text-gray-400 px-5 mb-3">Gestión</h3>

          <a
            routerLink="/candidates"
            routerLinkActive="bg-primary-600 shadow-xl scale-105"
            (click)="closeMenu()"
            class="flex items-center space-x-3 px-5 py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 group"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            <div class="flex-1">
              <div class="font-semibold">Candidatos</div>
              <div class="text-xs text-gray-400">Ver análisis guardados</div>
            </div>
          </a>
        </div>
      </nav>
    </aside>
  `
})
export class SidebarComponent {
  isOpen = signal(false);

  toggleMenu() {
    this.isOpen.update(value => !value);
  }

  closeMenu() {
    this.isOpen.set(false);
  }
}

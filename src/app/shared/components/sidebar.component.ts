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
    <aside [class]="'bg-black text-white w-64 flex-shrink-0 overflow-y-auto transition-transform duration-300 ' +
                    'md:translate-x-0 md:relative fixed inset-y-0 left-0 z-40 ' +
                    (isOpen() ? 'translate-x-0' : '-translate-x-full')">
      <nav class="p-4 space-y-2" style="height: 100vh;">
        <a
          routerLink="/cv-analysis"
          routerLinkActive="bg-primary-600"
          (click)="closeMenu()"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span>Analizar CVs</span>
        </a>

        <a
          routerLink="/candidates"
          routerLinkActive="bg-primary-600"
          (click)="closeMenu()"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
          <span>Gestionar Candidatos</span>
        </a>
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

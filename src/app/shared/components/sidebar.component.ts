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
          routerLink="/dashboard"
          routerLinkActive="bg-primary-600"
          (click)="closeMenu()"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          <span>Dashboard</span>
        </a>

        <a
          routerLink="/contacts"
          routerLinkActive="bg-primary-600"
          (click)="closeMenu()"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          <span>Contactos</span>
        </a>

        <a
          routerLink="/emails"
          routerLinkActive="bg-primary-600"
          (click)="closeMenu()"
          class="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <span>Email Marketing</span>
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

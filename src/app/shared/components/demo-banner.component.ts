import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200 py-2.5 px-4">
      <div class="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-sm text-amber-900">
          <span class="font-semibold">Entorno de Demostración:</span>
          <span class="ml-1.5">Este agente utiliza datos ficticios para ilustrar su funcionalidad en un ambiente real. Todas las respuestas y análisis son simulados con fines demostrativos.</span>
        </p>
      </div>
    </div>
  `
})
export class DemoBannerComponent {}

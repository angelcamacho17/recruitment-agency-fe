import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-gray-500 text-xs sm:text-sm font-medium truncate">Total Contactos</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{{ overview?.total_contacts || '0' }}</p>
          </div>
          <div class="bg-primary-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-2">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-green-600 mt-2 sm:mt-4">{{ overview?.active_contacts || '0' }} activos</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-gray-500 text-xs sm:text-sm font-medium truncate">Mensajes (7 días)</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{{ overview?.messages_last_7_days || '0' }}</p>
          </div>
          <div class="bg-green-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-2">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4">Total: {{ overview?.total_messages || '0' }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-gray-500 text-xs sm:text-sm font-medium truncate">Contactados (7 días)</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{{ overview?.contacted_last_7_days || '0' }}</p>
          </div>
          <div class="bg-yellow-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-2">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4 truncate">30 días: {{ overview?.contacted_last_30_days || '0' }}</p>
      </div>

      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-gray-500 text-xs sm:text-sm font-medium truncate">Tasa Recurrencia</p>
            <p class="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{{ engagement?.repeat_contact_rate || '0' }}%</p>
          </div>
          <div class="bg-accent-100 rounded-full p-2 sm:p-3 flex-shrink-0 ml-2">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
        <p class="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-4 truncate">Recurrentes: {{ engagement?.repeat_contacts || '0' }}</p>
      </div>
    </div>
  `
})
export class StatsCardsComponent {
  @Input() overview: any;
  @Input() engagement: any;
}

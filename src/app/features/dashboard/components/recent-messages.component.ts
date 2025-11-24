import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-messages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Mensajes Recientes</h3>

      <!-- Mobile View -->
      <div class="md:hidden space-y-3">
        <div *ngFor="let message of recentMessages" class="border border-gray-200 rounded-lg p-3">
          <div class="flex justify-between items-start mb-2">
            <span class="text-sm font-medium text-gray-900">{{ message.phone_number }}</span>
            <span [class]="getStatusClass(message.status)">{{ message.status }}</span>
          </div>
          <p class="text-sm text-gray-500 mb-2 line-clamp-2">{{ message.message_body }}</p>
          <p class="text-xs text-gray-400">{{ formatDate(message.sent_at) }}</p>
        </div>
        <div *ngIf="!recentMessages || recentMessages.length === 0" class="text-center py-4 text-gray-500 text-sm">
          No hay mensajes recientes
        </div>
      </div>

      <!-- Desktop View -->
      <div class="hidden md:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let message of recentMessages">
              <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ message.phone_number }}
              </td>
              <td class="px-4 lg:px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                {{ message.message_body }}
              </td>
              <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(message.sent_at) }}
              </td>
              <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                <span [class]="getStatusClass(message.status)">
                  {{ message.status }}
                </span>
              </td>
            </tr>
            <tr *ngIf="!recentMessages || recentMessages.length === 0">
              <td colspan="4" class="px-4 lg:px-6 py-4 text-center text-gray-500">
                No hay mensajes recientes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class RecentMessagesComponent {
  @Input() recentMessages: any[] = [];

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusClass(status: string): string {
    const baseClass = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status.toLowerCase()) {
      case 'sent':
      case 'delivered':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'failed':
        return `${baseClass} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClass} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }
}

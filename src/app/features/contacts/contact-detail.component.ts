import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContactsService } from '../../core/services/contacts.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="p-4 sm:p-6 bg-gray-50">
      <div class="mb-4 sm:mb-6">
        <a routerLink="/contacts" class="text-primary-600 hover:text-primary-900 flex items-center text-sm sm:text-base">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver a Contactos
        </a>
      </div>

      <div *ngIf="loading()">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="error()" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error() }}
      </div>

      <div *ngIf="!loading() && !error() && contactHistory()">
        <!-- Información del Contacto -->
        <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
            <div>
              <h1 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{{ contactHistory().contact.phone_number_formatted }}</h1>
              <p class="text-gray-600 text-sm">ID: {{ contactHistory().contact.id }}</p>
            </div>
            <span [class]="getStatusClass(contactHistory().contact.status)">
              {{ contactHistory().contact.status }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <p class="text-sm text-gray-500">Primera vez contactado</p>
              <p class="text-lg font-semibold text-gray-900">{{ formatDate(contactHistory().contact.first_contact_date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Última vez contactado</p>
              <p class="text-lg font-semibold text-gray-900">{{ formatDate(contactHistory().contact.last_contact_date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Veces contactado</p>
              <p class="text-lg font-semibold text-gray-900">{{ contactHistory().contact.contact_count }}</p>
            </div>
          </div>

          <!-- Tags -->
          <div class="mb-4 sm:mb-6">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Tags</h3>
            <div class="flex flex-wrap gap-2 mb-4">
              <span *ngFor="let tag of contactHistory().contact.tags" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {{ tag }}
              </span>
              <span *ngIf="contactHistory().contact.tags.length === 0" class="text-gray-500">No hay tags</span>
            </div>

            <!-- Agregar Tags -->
            <div class="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                [(ngModel)]="newTags"
                placeholder="Agregar tags (separados por comas)"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                (click)="addTags()"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm whitespace-nowrap"
              >
                Agregar
              </button>
            </div>
          </div>

          <!-- Cambiar Estado -->
          <div>
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Cambiar Estado</h3>
            <div class="flex flex-col sm:flex-row gap-2">
              <select
                [(ngModel)]="newStatus"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="blocked">Bloqueado</option>
              </select>
              <button
                (click)="updateStatus()"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm whitespace-nowrap"
              >
                Actualizar Estado
              </button>
            </div>
          </div>
        </div>

        <!-- Historial de Mensajes -->
        <div class="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Historial de Mensajes ({{ contactHistory().messages.length }})</h2>

          <div *ngIf="contactHistory().messages.length === 0" class="text-center py-8 text-gray-500">
            No hay mensajes en el historial
          </div>

          <div class="space-y-4">
            <div *ngFor="let message of contactHistory().messages" class="border-l-4 border-primary-600 bg-gray-50 p-4 rounded-r-lg">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <p class="text-sm text-gray-500 mb-1">{{ formatDate(message.sent_at) }}</p>
                  <p class="text-gray-900">{{ message.message_body }}</p>
                </div>
                <span [class]="getMessageStatusClass(message.status)">
                  {{ message.status }}
                </span>
              </div>

              <div *ngIf="message.pdf_url" class="mt-2">
                <a [href]="message.pdf_url" target="_blank" class="text-primary-600 hover:text-primary-900 text-sm flex items-center">
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  Ver PDF adjunto
                </a>
              </div>

              <div *ngIf="message.tags && message.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
                <span *ngFor="let tag of message.tags" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactDetailComponent implements OnInit {
  private contactsService = inject(ContactsService);
  private route = inject(ActivatedRoute);

  contactHistory = signal<any>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  newTags = '';
  newStatus = 'active';

  ngOnInit() {
    const contactId = this.route.snapshot.paramMap.get('id');
    if (contactId) {
      this.loadContactHistory(parseInt(contactId));
    }
  }

  loadContactHistory(contactId: number) {
    this.loading.set(true);
    this.error.set(null);

    this.contactsService.getContactHistory(contactId).subscribe({
      next: (response) => {
        if (response.success) {
          this.contactHistory.set(response.data);
          this.newStatus = response.data.contact.status;
        } else {
          this.error.set(response.error || 'Error al cargar el historial');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al conectar con el servidor');
        this.loading.set(false);
        console.error('Error loading contact history:', err);
      }
    });
  }

  addTags() {
    if (!this.newTags.trim() || !this.contactHistory()) return;

    const tags = this.newTags.split(',').map(t => t.trim()).filter(t => t);
    const contactId = this.contactHistory().contact.id;

    this.contactsService.addTags(contactId, tags).subscribe({
      next: (response) => {
        if (response.success) {
          this.newTags = '';
          this.loadContactHistory(contactId);
        } else {
          alert('Error al agregar tags: ' + response.error);
        }
      },
      error: (err) => {
        alert('Error al agregar tags');
        console.error(err);
      }
    });
  }

  updateStatus() {
    if (!this.contactHistory()) return;

    const contactId = this.contactHistory().contact.id;

    this.contactsService.updateContactStatus(contactId, this.newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadContactHistory(contactId);
          alert('Estado actualizado correctamente');
        } else {
          alert('Error al actualizar estado: ' + response.error);
        }
      },
      error: (err) => {
        alert('Error al actualizar estado');
        console.error(err);
      }
    });
  }

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
    const baseClass = 'px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full';
    switch (status) {
      case 'active':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'inactive':
        return `${baseClass} bg-gray-100 text-gray-800`;
      case 'blocked':
        return `${baseClass} bg-red-100 text-red-800`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  getMessageStatusClass(status: string): string {
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

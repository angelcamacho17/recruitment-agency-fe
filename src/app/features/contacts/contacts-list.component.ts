import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactsService } from '../../core/services/contacts.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LoadingSpinnerComponent],
  template: `
    <div class="p-4 sm:p-6 bg-gray-50">
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Contactos</h1>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por teléfono</label>
            <input
              type="text"
              [(ngModel)]="searchPhone"
              (input)="onSearch()"
              placeholder="+52 442 123 4567"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              [(ngModel)]="statusFilter"
              (change)="onFilterChange()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="blocked">Bloqueados</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              [(ngModel)]="searchTags"
              (input)="onSearch()"
              placeholder="tag1, tag2"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <!-- Filtros de Fecha -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha inicio</label>
            <input
              type="date"
              [(ngModel)]="startDate"
              (change)="onFilterChange()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Fecha fin</label>
            <input
              type="date"
              [(ngModel)]="endDate"
              (change)="onFilterChange()"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div class="flex items-end">
            <button
              (click)="clearDateFilters()"
              class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Limpiar fechas
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading()">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <!-- Error -->
      <div *ngIf="error()" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error() }}
      </div>

      <!-- Tabla de Contactos -->
      <div *ngIf="!loading() && !error()" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primera vez</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última vez</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veces</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let contact of contacts()" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ contact.phone_number_formatted || contact.phone_number }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(contact.first_contact_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(contact.last_contact_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ contact.contact_count }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let tag of contact.tags" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(contact.status)">
                    {{ contact.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <a [routerLink]="['/contacts', contact.id]" class="text-primary-600 hover:text-primary-900">Ver detalle</a>
                </td>
              </tr>
              <tr *ngIf="contacts().length === 0">
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                  No se encontraron contactos
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div class="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              (click)="previousPage()"
              [disabled]="currentPage() === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Anterior
            </button>
            <button
              (click)="nextPage()"
              [disabled]="contacts().length < pageSize()"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Página <span class="font-medium">{{ currentPage() }}</span> - Mostrando <span class="font-medium">{{ contacts().length }}</span> contactos
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  (click)="previousPage()"
                  [disabled]="currentPage() === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Anterior
                </button>
                <button
                  (click)="nextPage()"
                  [disabled]="contacts().length < pageSize()"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactsListComponent implements OnInit {
  private contactsService = inject(ContactsService);

  contacts = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  currentPage = signal<number>(1);
  pageSize = signal<number>(50);

  searchPhone = '';
  searchTags = '';
  statusFilter = 'all';
  startDate = '';
  endDate = '';

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.loading.set(true);
    this.error.set(null);

    const status = this.statusFilter === 'all' ? 'active' : this.statusFilter;

    this.contactsService.getAllContacts(
      this.currentPage(),
      this.pageSize(),
      status,
      this.startDate || undefined,
      this.endDate || undefined
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.contacts.set(response.data || []);
        } else {
          this.error.set(response.error || 'Error al cargar contactos');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al conectar con el servidor');
        this.loading.set(false);
        console.error('Error loading contacts:', err);
      }
    });
  }

  clearDateFilters() {
    this.startDate = '';
    this.endDate = '';
    this.onFilterChange();
  }

  onSearch() {
    if (this.searchPhone || this.searchTags) {
      const criteria: any = {};
      if (this.searchPhone) criteria.phoneNumber = this.searchPhone;
      if (this.searchTags) criteria.tags = this.searchTags.split(',').map(t => t.trim());

      this.loading.set(true);
      this.contactsService.searchContacts(criteria).subscribe({
        next: (response) => {
          if (response.success) {
            this.contacts.set(response.data || []);
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error en la búsqueda');
          this.loading.set(false);
        }
      });
    } else {
      this.loadContacts();
    }
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.loadContacts();
  }

  nextPage() {
    this.currentPage.update(page => page + 1);
    this.loadContacts();
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.loadContacts();
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    const baseClass = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
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
}

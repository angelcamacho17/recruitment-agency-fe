import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailsService } from '../../core/services/emails.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { Email, EmailStatistics } from '../../core/models/email.model';

@Component({
  selector: 'app-emails-list',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="p-4 sm:p-6 bg-gray-50">
      <div class="flex justify-between items-center mb-4 sm:mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Email Marketing</h1>
        <button
          (click)="downloadCSV()"
          [disabled]="downloading()"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <svg *ngIf="!downloading()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span *ngIf="downloading()">Copiando...</span>
          <span *ngIf="!downloading()">Copiar Emails</span>
        </button>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="text-sm text-gray-600 mb-1">Total Emails</div>
          <div class="text-2xl font-bold text-gray-900">{{ statistics()?.total_emails || 0 }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="text-sm text-gray-600 mb-1">Emails Activos</div>
          <div class="text-2xl font-bold text-green-600">{{ statistics()?.active_emails || 0 }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="text-sm text-gray-600 mb-1">Total Enviados</div>
          <div class="text-2xl font-bold text-blue-600">{{ statistics()?.total_emails_sent || 0 }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="text-sm text-gray-600 mb-1">Últimos 7 días</div>
          <div class="text-2xl font-bold text-purple-600">{{ statistics()?.contacted_last_7_days || 0 }}</div>
        </div>
        <div class="bg-white rounded-lg shadow-md p-4">
          <div class="text-sm text-gray-600 mb-1">Últimos 30 días</div>
          <div class="text-2xl font-bold text-orange-600">{{ statistics()?.contacted_last_30_days || 0 }}</div>
        </div>
      </div>

      <!-- Filtros de Búsqueda -->
      <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por email</label>
            <input
              type="email"
              [(ngModel)]="searchEmail"
              (input)="onSearch()"
              placeholder="ejemplo@gmail.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar por nombre</label>
            <input
              type="text"
              [(ngModel)]="searchName"
              (input)="onSearch()"
              placeholder="Juan Pérez"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
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
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Min. Emails Enviados</label>
            <input
              type="number"
              [(ngModel)]="minEmailCount"
              (input)="onSearch()"
              placeholder="0"
              min="0"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button
            (click)="clearFilters()"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpiar filtros
          </button>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Estado</label>
            <select
              [(ngModel)]="statusFilter"
              (change)="onFilterChange()"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="blocked">Bloqueados</option>
            </select>
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

      <!-- Tabla de Emails -->
      <div *ngIf="!loading() && !error()" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <table class="min-w-full divide-y divide-gray-200 text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Primer Contacto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Contacto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Emails Enviados</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último Asunto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let email of emails()" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ email.email }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ email.name || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(email.first_contact_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(email.last_contact_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {{ email.email_count }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {{ email.last_subject_sent || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex flex-wrap gap-1">
                    <span *ngFor="let tag of email.tags" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(email.status)">
                    {{ email.status }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="emails().length === 0">
                <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                  No se encontraron emails
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
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage() >= totalPages()"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Página <span class="font-medium">{{ currentPage() }}</span> de <span class="font-medium">{{ totalPages() }}</span> -
                Mostrando <span class="font-medium">{{ emails().length }}</span> de <span class="font-medium">{{ totalEmails() }}</span> emails
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  (click)="previousPage()"
                  [disabled]="currentPage() === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button
                  (click)="nextPage()"
                  [disabled]="currentPage() >= totalPages()"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
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
export class EmailsListComponent implements OnInit {
  private emailsService = inject(EmailsService);

  emails = signal<Email[]>([]);
  statistics = signal<EmailStatistics | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  currentPage = signal<number>(1);
  pageSize = signal<number>(50);
  totalPages = signal<number>(1);
  totalEmails = signal<number>(0);

  searchEmail = '';
  searchName = '';
  searchTags = '';
  minEmailCount: number | null = null;
  statusFilter = 'active';
  downloading = signal<boolean>(false);

  ngOnInit() {
    this.loadStatistics();
    this.loadEmails();
  }

  loadStatistics() {
    this.emailsService.getStatistics().subscribe({
      next: (response) => {
        if (response.success) {
          this.statistics.set(response.statistics);
        }
      },
      error: (err) => {
        console.error('Error loading statistics:', err);
      }
    });
  }

  loadEmails() {
    this.loading.set(true);
    this.error.set(null);

    this.emailsService.getAllEmails(
      this.currentPage(),
      this.pageSize(),
      this.statusFilter
    ).subscribe({
      next: (response) => {
        if (response.success) {
          this.emails.set(response.emails || []);
          this.totalPages.set(response.pagination.totalPages);
          this.totalEmails.set(response.pagination.total);
        } else {
          this.error.set(response.error || 'Error al cargar emails');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al conectar con el servidor');
        this.loading.set(false);
        console.error('Error loading emails:', err);
      }
    });
  }

  onSearch() {
    if (this.searchEmail || this.searchName || this.searchTags || this.minEmailCount) {
      const criteria: any = {};
      if (this.searchEmail) criteria.email = this.searchEmail;
      if (this.searchName) criteria.name = this.searchName;
      if (this.searchTags) criteria.tags = this.searchTags.split(',').map(t => t.trim());
      if (this.minEmailCount) criteria.minEmailCount = this.minEmailCount;

      this.loading.set(true);
      this.emailsService.searchEmails(criteria).subscribe({
        next: (response) => {
          if (response.success) {
            this.emails.set(response.emails || []);
            this.totalPages.set(1);
            this.totalEmails.set(response.count || 0);
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Error en la búsqueda');
          this.loading.set(false);
        }
      });
    } else {
      this.loadEmails();
    }
  }

  clearFilters() {
    this.searchEmail = '';
    this.searchName = '';
    this.searchTags = '';
    this.minEmailCount = null;
    this.currentPage.set(1);
    this.loadEmails();
  }

  onFilterChange() {
    this.currentPage.set(1);
    this.loadEmails();
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.loadEmails();
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.loadEmails();
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
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

  downloadCSV() {
    this.downloading.set(true);
    // Obtener todos los emails usando un límite muy grande
    this.emailsService.getAllEmails(1, 100000, this.statusFilter).subscribe({
      next: (response) => {
        if (response.success && response.emails) {
          const emailsString = response.emails.map(email => email.email).join(',');
          navigator.clipboard.writeText(emailsString).then(() => {
            alert(`${response.emails.length} emails copiados al portapapeles`);
          }).catch(err => {
            console.error('Error al copiar al portapapeles:', err);
            alert('Error al copiar emails al portapapeles');
          });
        } else {
          alert('Error al exportar emails');
        }
        this.downloading.set(false);
      },
      error: (err) => {
        console.error('Error downloading emails:', err);
        alert('Error al cargar emails');
        this.downloading.set(false);
      }
    });
  }
}

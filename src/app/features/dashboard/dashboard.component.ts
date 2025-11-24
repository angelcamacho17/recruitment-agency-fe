import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';
import { StatsCardsComponent } from './components/stats-cards.component';
import { ActivityChartComponent } from './components/activity-chart.component';
import { TopTagsComponent } from './components/top-tags.component';
import { RecentMessagesComponent } from './components/recent-messages.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LoadingSpinnerComponent,
    StatsCardsComponent,
    ActivityChartComponent,
    TopTagsComponent,
    RecentMessagesComponent
  ],
  template: `
    <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Dashboard</h1>

      <div *ngIf="loading()">
        <app-loading-spinner></app-loading-spinner>
      </div>

      <div *ngIf="error()" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
        {{ error() }}
      </div>

      <div *ngIf="!loading() && !error() && dashboardData()">
        <app-stats-cards
          [overview]="dashboardData().overview"
          [engagement]="dashboardData().engagement">
        </app-stats-cards>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div class="lg:col-span-2">
            <app-activity-chart [dailyActivity]="dashboardData().dailyActivity"></app-activity-chart>
          </div>
          <div>
            <app-top-tags [topTags]="dashboardData().topTags"></app-top-tags>
          </div>
        </div>

        <app-recent-messages [recentMessages]="dashboardData().recentMessages"></app-recent-messages>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  dashboardData = signal<any>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadDashboardData();

    // Auto-refresh cada 30 segundos
    setInterval(() => this.loadDashboardData(), 30000);
  }

  loadDashboardData() {
    this.loading.set(true);
    this.dashboardService.getAllDashboardData().subscribe({
      next: (response) => {
        if (response.success) {
          this.dashboardData.set(response.data);
        } else {
          this.error.set(response.error || 'Error al cargar datos');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al conectar con el servidor. Verifica que la API esté funcionando.');
        this.loading.set(false);
        console.error('Error loading dashboard:', err);
      }
    });
  }
}

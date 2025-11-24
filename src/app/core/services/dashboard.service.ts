import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private api = inject(ApiService);

  getAllDashboardData(): Observable<ApiResponse> {
    return this.api.get('/dashboard/all');
  }

  getOverview(): Observable<ApiResponse> {
    return this.api.get('/dashboard/overview');
  }

  getDailyActivity(): Observable<ApiResponse> {
    return this.api.get('/dashboard/daily-activity');
  }

  getTopTags(): Observable<ApiResponse> {
    return this.api.get('/dashboard/top-tags');
  }

  getTopContacts(limit: number = 10): Observable<ApiResponse> {
    return this.api.get(`/dashboard/top-contacts?limit=${limit}`);
  }

  getRecentMessages(limit: number = 20): Observable<ApiResponse> {
    return this.api.get(`/dashboard/recent-messages?limit=${limit}`);
  }

  getEngagement(): Observable<ApiResponse> {
    return this.api.get('/dashboard/engagement');
  }

  getContactsByStatus(): Observable<ApiResponse> {
    return this.api.get('/dashboard/contacts-by-status');
  }

  getWeeklyGrowth(): Observable<ApiResponse> {
    return this.api.get('/dashboard/weekly-growth');
  }
}

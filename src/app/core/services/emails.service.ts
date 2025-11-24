import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import {
  EmailsResponse,
  EmailSearchCriteria,
  EmailSearchResponse,
  EmailStatisticsResponse
} from '../models/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  private apiService = inject(ApiService);

  getAllEmails(
    page: number = 1,
    limit: number = 50,
    status: string = 'active'
  ): Observable<EmailsResponse> {
    return this.apiService.get<EmailsResponse>(
      `/emails?page=${page}&limit=${limit}&status=${status}`
    );
  }

  searchEmails(criteria: EmailSearchCriteria): Observable<EmailSearchResponse> {
    return this.apiService.post<EmailSearchResponse>('/emails/search', criteria);
  }

  getStatistics(): Observable<EmailStatisticsResponse> {
    return this.apiService.get<EmailStatisticsResponse>('/emails/statistics');
  }
}

import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private api = inject(ApiService);

  getAllContacts(
    page: number = 1,
    limit: number = 50,
    status: string = 'active',
    startDate?: string,
    endDate?: string
  ): Observable<ApiResponse> {
    let url = `/contacts?page=${page}&limit=${limit}&status=${status}`;

    if (startDate) {
      url += `&start_date=${startDate}`;
    }

    if (endDate) {
      url += `&end_date=${endDate}`;
    }

    return this.api.get(url);
  }

  searchContacts(criteria: any): Observable<ApiResponse> {
    return this.api.post('/contacts/search', criteria);
  }

  getContactHistory(contactId: number): Observable<ApiResponse> {
    return this.api.get(`/contacts/${contactId}/history`);
  }

  updateContactStatus(contactId: number, status: string): Observable<ApiResponse> {
    return this.api.patch(`/contacts/${contactId}/status`, { status });
  }

  addTags(contactId: number, tags: string[]): Observable<ApiResponse> {
    return this.api.post(`/contacts/${contactId}/tags`, { tags });
  }
}

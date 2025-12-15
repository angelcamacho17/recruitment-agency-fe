import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AnalysesListResponse,
  AnalysisDetailResponse,
  CandidateSearchParams,
  CandidateSearchResponse,
  StatisticsResponse
} from '../models/analyses.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysesService {
  private apiUrl = `${environment.apiUrl}/cv-analysis`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de todos los análisis (paginada)
   * @param page Número de página (default: 1)
   * @param limit Cantidad por página (default: 20)
   */
  getAnalyses(page: number = 1, limit: number = 20): Observable<AnalysesListResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<AnalysesListResponse>(`${this.apiUrl}/analyses`, { params });
  }

  /**
   * Obtiene el detalle completo de un análisis con todos sus candidatos
   * @param id ID del análisis
   */
  getAnalysisDetail(id: number): Observable<AnalysisDetailResponse> {
    return this.http.get<AnalysisDetailResponse>(`${this.apiUrl}/analyses/${id}`);
  }

  /**
   * Busca candidatos con filtros específicos
   * @param searchParams Parámetros de búsqueda
   */
  searchCandidates(searchParams: CandidateSearchParams): Observable<CandidateSearchResponse> {
    let params = new HttpParams();

    if (searchParams.name) {
      params = params.set('name', searchParams.name);
    }
    if (searchParams.email) {
      params = params.set('email', searchParams.email);
    }
    if (searchParams.minScore !== undefined) {
      params = params.set('minScore', searchParams.minScore.toString());
    }
    if (searchParams.maxScore !== undefined) {
      params = params.set('maxScore', searchParams.maxScore.toString());
    }
    if (searchParams.category) {
      params = params.set('category', searchParams.category);
    }
    if (searchParams.analysisId) {
      params = params.set('analysisId', searchParams.analysisId.toString());
    }
    if (searchParams.limit) {
      params = params.set('limit', searchParams.limit.toString());
    }

    return this.http.get<CandidateSearchResponse>(`${this.apiUrl}/candidates/search`, { params });
  }

  /**
   * Obtiene el top de candidatos de todos los análisis
   * @param limit Cantidad de candidatos (default: 10)
   */
  getTopCandidates(limit: number = 10): Observable<CandidateSearchResponse> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<CandidateSearchResponse>(`${this.apiUrl}/candidates/top`, { params });
  }

  /**
   * Obtiene estadísticas generales de todos los análisis
   */
  getStatistics(): Observable<StatisticsResponse> {
    return this.http.get<StatisticsResponse>(`${this.apiUrl}/statistics`);
  }
}

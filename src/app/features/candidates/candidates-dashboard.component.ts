import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalysesService } from '../../core/services/analyses.service';
import {
  AnalysisSummary,
  CandidateDetail,
  Statistics,
  CandidateSearchParams
} from '../../core/models/analyses.model';

@Component({
  selector: 'app-candidates-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <!-- Back Button (when viewing candidate detail) -->
      <button
        *ngIf="selectedCandidate()"
        (click)="backToList()"
        class="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        <span>←</span> Volver
      </button>

      <!-- Candidate Detail View -->
      <div *ngIf="selectedCandidate() as candidate" class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold text-gray-900 blur-sm">{{ candidate.nombre || candidate.name }}</h1>
              <span class="px-3 py-1 text-sm rounded-lg" [class]="getCategoryBgColor(candidate.categoria || candidate.category!)">
                {{ getCategoryIcon(candidate.categoria || candidate.category!) }} {{ getCategoryLabel(candidate.categoria || candidate.category!) }}
              </span>
            </div>
            <div class="space-y-1">
              <p class="text-gray-600">📧 <span class="blur-sm">{{ candidate.email }}</span></p>
              <p *ngIf="candidate.telefono || candidate.phone" class="text-gray-600">
                📞 {{ candidate.telefono || candidate.phone }}
              </p>
              <p *ngIf="candidate.analysis_date" class="text-sm text-gray-400">
                Analizado: {{ candidate.analysis_date | date:'medium' }}
              </p>
            </div>
          </div>
          <div class="text-center ml-6">
            <div class="text-5xl font-bold mb-1" [class]="getScoreColor(candidate.score)">
              {{ candidate.score }}
            </div>
            <div class="text-sm text-gray-500">Score</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Fortaleza Principal -->
          <div class="p-4 bg-green-50 rounded-lg">
            <p class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span class="text-2xl">💪</span> Fortaleza Principal
            </p>
            <p class="text-gray-700">{{ candidate.fortalezaPrincipal || candidate.main_strength }}</p>
          </div>

          <!-- Bandera Roja -->
          <div class="p-4 bg-red-50 rounded-lg">
            <p class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <span class="text-2xl">🚩</span> Bandera Roja
            </p>
            <p class="text-gray-700">{{ candidate.banderaRoja || candidate.red_flag }}</p>
          </div>
        </div>

        <!-- Fortalezas -->
        <div *ngIf="candidate.fortalezas || candidate.strengths" class="mt-6 p-4 bg-blue-50 rounded-lg">
          <p class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span class="text-2xl">✨</span> Fortalezas
          </p>
          <ul class="space-y-2">
            <li *ngFor="let strength of (candidate.fortalezas || candidate.strengths)" class="flex items-start gap-2">
              <span class="text-blue-600 mt-1">•</span>
              <span class="text-gray-700">{{ strength }}</span>
            </li>
          </ul>
        </div>

        <!-- Áreas de Atención -->
        <div *ngIf="candidate.areasAtencion || candidate.areas_attention" class="mt-6 p-4 bg-yellow-50 rounded-lg">
          <p class="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span class="text-2xl">⚠️</span> Áreas de Atención
          </p>
          <ul class="space-y-2">
            <li *ngFor="let area of (candidate.areasAtencion || candidate.areas_attention)" class="flex items-start gap-2">
              <span class="text-yellow-600 mt-1">•</span>
              <span class="text-gray-700">{{ area }}</span>
            </li>
          </ul>
        </div>

        <!-- Consistencia -->
        <div *ngIf="candidate.consistencia || candidate.consistency" class="mt-6 p-4 bg-purple-50 rounded-lg">
          <p class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span class="text-2xl">🔍</span> Consistencia
          </p>
          <p class="text-gray-700">{{ candidate.consistencia || candidate.consistency }}</p>
        </div>

        <!-- Pregunta Sugerida -->
        <div *ngIf="candidate.preguntaSugerida || candidate.suggested_question" class="mt-6 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-500">
          <p class="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span class="text-2xl">💬</span> Pregunta Sugerida para la Entrevista
          </p>
          <p class="text-gray-700 italic">{{ candidate.preguntaSugerida || candidate.suggested_question }}</p>
        </div>
      </div>

      <!-- Dashboard View (when no candidate selected) -->
      <div *ngIf="!selectedCandidate()">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Gestión de Candidatos</h1>

        <!-- Estadísticas Generales -->
        <div *ngIf="statistics()" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Total Análisis</p>
                <p class="text-3xl font-bold text-gray-900">{{ statistics()!.total_analyses }}</p>
              </div>
              <div class="text-4xl">📊</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Candidatos Totales</p>
                <p class="text-3xl font-bold text-gray-900">{{ statistics()!.total_candidates_analyzed }}</p>
              </div>
              <div class="text-4xl">👥</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Para Entrevistar</p>
                <p class="text-3xl font-bold text-green-600">{{ statistics()!.candidates_to_interview }}</p>
              </div>
              <div class="text-4xl">✅</div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Score Promedio</p>
                <p class="text-3xl font-bold text-blue-600">{{ getAverageScore() }}</p>
              </div>
              <div class="text-4xl">⭐</div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="bg-white rounded-lg shadow mb-6">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button
                *ngFor="let tab of tabs"
                (click)="activeTab.set(tab.id)"
                [class]="'px-6 py-3 text-sm font-medium border-b-2 transition-colors ' +
                         (activeTab() === tab.id
                           ? 'border-blue-600 text-blue-600'
                           : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')"
              >
                <span class="mr-2">{{ tab.icon }}</span>
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Top Candidatos Tab -->
            <div *ngIf="activeTab() === 'top'">
              <h2 class="text-xl font-bold mb-4">🏆 Top 10 Candidatos</h2>

              <div *ngIf="loadingTop()" class="text-center py-8">
                <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p class="text-gray-600 mt-2">Cargando top candidatos...</p>
              </div>

              <div *ngIf="!loadingTop() && topCandidates().length > 0" class="space-y-3">
                <div
                  *ngFor="let candidate of topCandidates(); let i = index"
                  (click)="viewCandidateDetail(candidate)"
                  class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-blue-50 hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-blue-300"
                >
                  <div class="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {{ i + 1 }}
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 blur-sm">{{ candidate.nombre || candidate.name }}</h3>
                    <p class="text-sm text-gray-600 blur-sm">{{ candidate.email }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ candidate.fortalezaPrincipal || candidate.main_strength }}</p>
                  </div>
                  <div class="text-right">
                    <div class="text-2xl font-bold" [class]="getScoreColor(candidate.score)">
                      {{ candidate.score }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ getCategoryIcon(candidate.categoria || candidate.category!) }} {{ getCategoryLabel(candidate.categoria || candidate.category!) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Buscar Candidatos Tab -->
            <div *ngIf="activeTab() === 'search'">
              <h2 class="text-xl font-bold mb-4">🔍 Buscar Candidatos</h2>

              <!-- Filtros de búsqueda -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    [(ngModel)]="searchParams.name"
                    (ngModelChange)="searchCandidates()"
                    placeholder="Buscar por nombre..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    [(ngModel)]="searchParams.email"
                    (ngModelChange)="searchCandidates()"
                    placeholder="Buscar por email..."
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    [(ngModel)]="searchParams.category"
                    (ngModelChange)="searchCandidates()"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option [ngValue]="undefined">Todas</option>
                    <option value="entrevistar">✅ Para Entrevistar</option>
                    <option value="quizas">🤔 Quizás</option>
                    <option value="descartar">❌ Descartar</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Score Mínimo</label>
                  <input
                    type="number"
                    [(ngModel)]="searchParams.minScore"
                    (ngModelChange)="searchCandidates()"
                    min="0"
                    max="100"
                    placeholder="0"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Score Máximo</label>
                  <input
                    type="number"
                    [(ngModel)]="searchParams.maxScore"
                    (ngModelChange)="searchCandidates()"
                    min="0"
                    max="100"
                    placeholder="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex items-end">
                  <button
                    (click)="resetSearch()"
                    class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    🔄 Limpiar
                  </button>
                </div>
              </div>

              <!-- Resultados -->
              <div *ngIf="loadingSearch()" class="text-center py-8">
                <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p class="text-gray-600 mt-2">Buscando candidatos...</p>
              </div>

              <div *ngIf="!loadingSearch() && searchResults().length > 0">
                <p class="text-sm text-gray-600 mb-4">
                  Se encontraron {{ searchResults().length }} candidato(s)
                </p>

                <div class="space-y-3">
                  <div
                    *ngFor="let candidate of searchResults()"
                    (click)="viewCandidateDetail(candidate)"
                    class="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 blur-sm">{{ candidate.nombre || candidate.name }}</h3>
                        <p class="text-sm text-gray-600 blur-sm">{{ candidate.email }}</p>
                        <p class="text-sm text-gray-500 mt-1">📞 {{ candidate.telefono || candidate.phone }}</p>
                        <p class="text-sm text-gray-700 mt-2">
                          <strong>Fortaleza:</strong> {{ candidate.fortalezaPrincipal || candidate.main_strength }}
                        </p>
                        <p *ngIf="candidate.analysis_date" class="text-xs text-gray-400 mt-2">
                          Analizado: {{ candidate.analysis_date | date:'short' }}
                        </p>
                      </div>
                      <div class="text-right ml-4">
                        <div class="text-3xl font-bold mb-1" [class]="getScoreColor(candidate.score)">
                          {{ candidate.score }}
                        </div>
                        <div class="text-xs px-2 py-1 rounded" [class]="getCategoryBgColor(candidate.categoria || candidate.category!)">
                          {{ getCategoryIcon(candidate.categoria || candidate.category!) }} {{ getCategoryLabel(candidate.categoria || candidate.category!) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div *ngIf="!loadingSearch() && searchResults().length === 0" class="text-center py-12">
                <p class="text-gray-500">No se encontraron candidatos con los filtros seleccionados</p>
              </div>
            </div>

            <!-- Lista de Análisis Tab -->
            <div *ngIf="activeTab() === 'analyses'">
              <h2 class="text-xl font-bold mb-4">📋 Historial de Análisis</h2>

              <div *ngIf="loadingAnalyses()" class="text-center py-8">
                <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p class="text-gray-600 mt-2">Cargando análisis...</p>
              </div>

              <div *ngIf="!loadingAnalyses() && analyses().length > 0" class="space-y-4">
                <div
                  *ngFor="let analysis of analyses()"
                  [routerLink]="['/candidates/analysis', analysis.id]"
                  class="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                >
                  <div class="flex items-start justify-between mb-4">
                    <div>
                      <h3 class="font-semibold text-lg text-gray-900">{{ analysis.excel_file_name }}</h3>
                      <p class="text-sm text-gray-500">{{ analysis.analysis_date | date:'medium' }}</p>
                    </div>
                    <div class="text-right">
                      <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {{ analysis.total_candidates }} candidatos
                      </span>
                    </div>
                  </div>

                  <div class="grid grid-cols-3 gap-4 mb-4">
                    <div class="text-center p-3 bg-green-50 rounded">
                      <div class="text-2xl font-bold text-green-600">{{ analysis.summary.paraEntrevistar }}</div>
                      <div class="text-xs text-gray-600">Para entrevistar</div>
                    </div>
                    <div class="text-center p-3 bg-yellow-50 rounded">
                      <div class="text-2xl font-bold text-yellow-600">{{ analysis.summary.quizas }}</div>
                      <div class="text-xs text-gray-600">Quizás</div>
                    </div>
                    <div class="text-center p-3 bg-red-50 rounded">
                      <div class="text-2xl font-bold text-red-600">{{ analysis.summary.descartados }}</div>
                      <div class="text-xs text-gray-600">Descartados</div>
                    </div>
                  </div>

                  <div *ngIf="analysis.summary.top3.length > 0" class="border-t pt-3">
                    <p class="text-xs font-semibold text-gray-600 mb-2">🏆 Top 3:</p>
                    <div class="space-y-1">
                      <p *ngFor="let top of analysis.summary.top3" class="text-sm text-gray-700">
                        {{ top.nombre }} ({{ top.score }})
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Paginación -->
              <div *ngIf="pagination() && pagination()!.totalPages > 1" class="mt-6 flex justify-center gap-2">
                <button
                  (click)="loadAnalyses(pagination()!.page - 1)"
                  [disabled]="pagination()!.page === 1"
                  class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <span class="px-4 py-2 text-gray-700">
                  Página {{ pagination()!.page }} de {{ pagination()!.totalPages }}
                </span>
                <button
                  (click)="loadAnalyses(pagination()!.page + 1)"
                  [disabled]="pagination()!.page === pagination()!.totalPages"
                  class="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CandidatesDashboardComponent implements OnInit {
  private analysesService = inject(AnalysesService);

  // State
  statistics = signal<Statistics | null>(null);
  topCandidates = signal<CandidateDetail[]>([]);
  searchResults = signal<CandidateDetail[]>([]);
  analyses = signal<AnalysisSummary[]>([]);
  pagination = signal<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  selectedCandidate = signal<CandidateDetail | null>(null);

  // Loading states
  loadingTop = signal(false);
  loadingSearch = signal(false);
  loadingAnalyses = signal(false);

  // Search params
  searchParams: CandidateSearchParams = {};

  // Tabs
  tabs = [
    { id: 'top', label: 'Top Candidatos', icon: '🏆' },
    { id: 'search', label: 'Buscar', icon: '🔍' },
    { id: 'analyses', label: 'Análisis', icon: '📋' }
  ];
  activeTab = signal('top');

  ngOnInit() {
    this.loadStatistics();
    this.loadTopCandidates();
    this.loadAnalyses(1);
  }

  loadStatistics() {
    this.analysesService.getStatistics().subscribe({
      next: (response) => {
        if (response.success) {
          this.statistics.set(response.statistics);
        }
      },
      error: (err) => console.error('Error loading statistics:', err)
    });
  }

  loadTopCandidates() {
    this.loadingTop.set(true);
    this.analysesService.getTopCandidates(10).subscribe({
      next: (response) => {
        if (response.success) {
          this.topCandidates.set(response.candidates);
        }
        this.loadingTop.set(false);
      },
      error: (err) => {
        console.error('Error loading top candidates:', err);
        this.loadingTop.set(false);
      }
    });
  }

  searchCandidates() {
    this.loadingSearch.set(true);
    this.analysesService.searchCandidates(this.searchParams).subscribe({
      next: (response) => {
        if (response.success) {
          this.searchResults.set(response.candidates);
        }
        this.loadingSearch.set(false);
      },
      error: (err) => {
        console.error('Error searching candidates:', err);
        this.loadingSearch.set(false);
      }
    });
  }

  resetSearch() {
    this.searchParams = {};
    this.searchResults.set([]);
  }

  loadAnalyses(page: number = 1) {
    this.loadingAnalyses.set(true);
    this.analysesService.getAnalyses(page, 10).subscribe({
      next: (response) => {
        if (response.success) {
          this.analyses.set(response.analyses);
          this.pagination.set(response.pagination);
        }
        this.loadingAnalyses.set(false);
      },
      error: (err) => {
        console.error('Error loading analyses:', err);
        this.loadingAnalyses.set(false);
      }
    });
  }

  viewCandidateDetail(candidate: CandidateDetail) {
    this.selectedCandidate.set(candidate);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  backToList() {
    this.selectedCandidate.set(null);
  }

  getScoreColor(score: number): string {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'entrevistar': '✅',
      'quizas': '🤔',
      'descartar': '❌'
    };
    return icons[category] || '❓';
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'entrevistar': 'Entrevistar',
      'quizas': 'Quizás',
      'descartar': 'Descartar'
    };
    return labels[category] || category;
  }

  getCategoryBgColor(category: string): string {
    const colors: Record<string, string> = {
      'entrevistar': 'bg-green-100 text-green-800',
      'quizas': 'bg-yellow-100 text-yellow-800',
      'descartar': 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  }

  getAverageScore(): string {
    const stats = this.statistics();
    if (!stats || stats.average_score == null) {
      return '0.0';
    }
    const score = Number(stats.average_score);
    return isNaN(score) ? '0.0' : score.toFixed(1);
  }
}

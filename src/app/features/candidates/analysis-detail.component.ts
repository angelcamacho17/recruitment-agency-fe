import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnalysesMockService } from '../../core/services/analyses-mock.service';
import { AnalysisDetail, CandidateDetail } from '../../core/models/analyses.model';

@Component({
  selector: 'app-analysis-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <!-- Back button -->
      <button
        (click)="goBack()"
        class="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
      >
        <span>←</span> Volver
      </button>

      <div *ngIf="loading()" class="text-center py-12">
        <div class="animate-spin inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        <p class="text-gray-600 mt-4">Cargando análisis...</p>
      </div>

      <div *ngIf="error()" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p class="text-red-800">{{ error() }}</p>
      </div>

      <div *ngIf="analysis() as analysisData">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ analysisData.excel_file_name }}</h1>
          <p class="text-gray-600 mb-4">📅 {{ analysisData.analysis_date | date:'medium' }}</p>

          <!-- Summary Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-3xl font-bold text-blue-600">{{ analysisData.total_candidates }}</div>
              <div class="text-sm text-gray-600">Total Candidatos</div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-3xl font-bold text-green-600">{{ analysisData.summary.paraEntrevistar }}</div>
              <div class="text-sm text-gray-600">Para Entrevistar</div>
            </div>
            <div class="text-center p-4 bg-yellow-50 rounded-lg">
              <div class="text-3xl font-bold text-yellow-600">{{ analysisData.summary.quizas }}</div>
              <div class="text-sm text-gray-600">Quizás</div>
            </div>
            <div class="text-center p-4 bg-red-50 rounded-lg">
              <div class="text-3xl font-bold text-red-600">{{ analysisData.summary.descartados }}</div>
              <div class="text-sm text-gray-600">Descartados</div>
            </div>
          </div>

          <!-- Top 3 -->
          <div *ngIf="analysisData.summary.top3.length > 0" class="border-t pt-4">
            <h2 class="text-xl font-bold mb-3">🏆 Top 3 Candidatos</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div *ngFor="let top of analysisData.summary.top3; let i = index" class="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    {{ i + 1 }}
                  </div>
                  <h3 class="font-semibold text-gray-900">{{ top.nombre }}</h3>
                </div>
                <div class="text-2xl font-bold text-yellow-600 mb-1">{{ top.score }}</div>
                <p class="text-sm text-gray-700">{{ top.razon }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <h2 class="text-lg font-semibold mb-3">Filtros</h2>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                type="text"
                [(ngModel)]="filterText"
                (ngModelChange)="applyFilters()"
                placeholder="Nombre o email..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                [(ngModel)]="filterCategory"
                (ngModelChange)="applyFilters()"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="entrevistar">✅ Para Entrevistar</option>
                <option value="quizas">🤔 Quizás</option>
                <option value="descartar">❌ Descartar</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
              <select
                [(ngModel)]="sortBy"
                (ngModelChange)="applyFilters()"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="score-desc">Score (Mayor a menor)</option>
                <option value="score-asc">Score (Menor a mayor)</option>
                <option value="name">Nombre (A-Z)</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                (click)="resetFilters()"
                class="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                🔄 Limpiar
              </button>
            </div>
          </div>
        </div>

        <!-- Candidates List -->
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 border-b">
            <h2 class="text-xl font-bold">
              Candidatos ({{ filteredCandidates().length }} de {{ analysisData.candidates.length }})
            </h2>
          </div>

          <div class="divide-y">
            <div
              *ngFor="let candidate of filteredCandidates()"
              class="p-6 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <!-- Candidate Info -->
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">{{ candidate.nombre || candidate.name }}</h3>
                    <span class="px-2 py-1 text-xs rounded" [class]="getCategoryBgColor(candidate.categoria)">
                      {{ getCategoryIcon(candidate.categoria) }} {{ getCategoryLabel(candidate.categoria) }}
                    </span>
                  </div>

                  <div class="space-y-1 mb-3">
                    <p class="text-sm text-gray-600">📧 {{ candidate.email }}</p>
                    <p *ngIf="candidate.telefono || candidate.phone" class="text-sm text-gray-600">
                      📞 {{ candidate.telefono || candidate.phone }}
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p class="font-semibold text-gray-700">💪 Fortaleza Principal:</p>
                      <p class="text-gray-600">{{ candidate.fortalezaPrincipal || candidate.main_strength }}</p>
                    </div>
                    <div>
                      <p class="font-semibold text-gray-700">🚩 Bandera Roja:</p>
                      <p class="text-gray-600">{{ candidate.banderaRoja || candidate.red_flag }}</p>
                    </div>
                  </div>

                  <div *ngIf="candidate.fortalezas || candidate.strengths" class="mt-3">
                    <p class="font-semibold text-gray-700 text-sm mb-1">✨ Fortalezas:</p>
                    <ul class="list-disc list-inside text-sm text-gray-600">
                      <li *ngFor="let strength of (candidate.fortalezas || candidate.strengths)">{{ strength }}</li>
                    </ul>
                  </div>

                  <div *ngIf="candidate.areasAtencion || candidate.areas_attention" class="mt-3">
                    <p class="font-semibold text-gray-700 text-sm mb-1">⚠️ Áreas de Atención:</p>
                    <ul class="list-disc list-inside text-sm text-gray-600">
                      <li *ngFor="let area of (candidate.areasAtencion || candidate.areas_attention)">{{ area }}</li>
                    </ul>
                  </div>

                  <div *ngIf="candidate.preguntaSugerida || candidate.suggested_question" class="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p class="font-semibold text-gray-700 text-sm mb-1">💬 Pregunta Sugerida:</p>
                    <p class="text-sm text-gray-700 italic">{{ candidate.preguntaSugerida || candidate.suggested_question }}</p>
                  </div>
                </div>

                <!-- Score Badge -->
                <div class="ml-6 text-center">
                  <div class="text-4xl font-bold mb-1" [class]="getScoreColor(candidate.score)">
                    {{ candidate.score }}
                  </div>
                  <div class="text-xs text-gray-500">Score</div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="filteredCandidates().length === 0" class="p-12 text-center text-gray-500">
            No se encontraron candidatos con los filtros aplicados
          </div>
        </div>

        <!-- Metadata Footer -->
        <div class="mt-6 bg-white rounded-lg shadow p-4 text-sm text-gray-600">
          <h3 class="font-semibold mb-2">📊 Metadata del Análisis</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
            <p>CVs Procesados: <span class="font-semibold">{{ analysisData.total_cvs_processed }}</span></p>
            <p *ngIf="analysisData.metadata?.cvErrors !== undefined">Errores de CV: <span class="font-semibold">{{ analysisData.metadata.cvErrors }}</span></p>
            <p *ngIf="analysisData.metadata?.promptSize">Tamaño del Prompt: <span class="font-semibold">{{ analysisData.metadata.promptSize }} chars</span></p>
          </div>
          <p class="mt-2 text-xs text-gray-500">Hash: {{ analysisData.excel_file_hash }}</p>
        </div>
      </div>
    </div>
  `
})
export class AnalysisDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private analysesService = inject(AnalysesMockService);

  // State
  analysis = signal<AnalysisDetail | null>(null);
  filteredCandidates = signal<CandidateDetail[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Filter state
  filterText = '';
  filterCategory = '';
  sortBy = 'score-desc';

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAnalysis(parseInt(id, 10));
    } else {
      this.error.set('ID de análisis no válido');
    }
  }

  loadAnalysis(id: number) {
    this.loading.set(true);
    this.error.set(null);

    this.analysesService.getAnalysisDetail(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.analysis.set(response.analysis);
          this.applyFilters();
        } else {
          this.error.set('No se pudo cargar el análisis');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading analysis:', err);
        this.error.set('Error al cargar el análisis: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  applyFilters() {
    const analysisData = this.analysis();
    if (!analysisData) {
      this.filteredCandidates.set([]);
      return;
    }

    let candidates = [...analysisData.candidates];

    // Filter by text
    if (this.filterText.trim()) {
      const text = this.filterText.toLowerCase();
      candidates = candidates.filter(c =>
        (c.nombre || c.name || '').toLowerCase().includes(text) ||
        c.email.toLowerCase().includes(text)
      );
    }

    // Filter by category
    if (this.filterCategory) {
      candidates = candidates.filter(c => (c.categoria || c.category) === this.filterCategory);
    }

    // Sort
    candidates.sort((a, b) => {
      if (this.sortBy === 'score-desc') return b.score - a.score;
      if (this.sortBy === 'score-asc') return a.score - b.score;
      if (this.sortBy === 'name') {
        const nameA = (a.nombre || a.name || '').toLowerCase();
        const nameB = (b.nombre || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

    this.filteredCandidates.set(candidates);
  }

  resetFilters() {
    this.filterText = '';
    this.filterCategory = '';
    this.sortBy = 'score-desc';
    this.applyFilters();
  }

  goBack() {
    this.router.navigate(['/candidates']);
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
}

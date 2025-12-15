import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CvAnalysisService } from '../../core/services/cv-analysis.service';
import { AnalysisResult, CandidateScore } from '../../core/models/cv-analysis.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner.component';

@Component({
  selector: 'app-cv-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingSpinnerComponent],
  template: `
    <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Análisis de CVs con Claude</h1>
      <p class="text-gray-600 mb-6 text-sm sm:text-base">Analiza candidatos para Victoria Poggioli usando Inteligencia Artificial</p>

      <!-- Formulario de carga -->
      <div *ngIf="!analysisResult()" class="bg-white rounded-lg shadow-md p-4 sm:p-6 max-w-4xl">
        <div class="space-y-6">

          <!-- Archivo Excel -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Archivo Excel (respuestas de Google Forms) *
            </label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              (change)="onExcelFileSelected($event)"
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
            <p class="text-xs text-gray-500 mt-1" *ngIf="excelFile()">
              Archivo seleccionado: {{ excelFile()?.name }}
            </p>
          </div>

          <!-- CVs en PDF -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CVs en PDF (opcional, múltiples archivos)
            </label>
            <input
              type="file"
              accept=".pdf"
              multiple
              (change)="onPdfFilesSelected($event)"
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
            />
            <p class="text-xs text-gray-500 mt-1" *ngIf="pdfFiles().length > 0">
              {{ pdfFiles().length }} archivo(s) seleccionado(s)
            </p>
            <div *ngIf="pdfFiles().length > 0" class="mt-2 space-y-1">
              <div *ngFor="let file of pdfFiles()" class="text-xs text-gray-600 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
                </svg>
                {{ file.name }}
              </div>
            </div>
          </div>

          <!-- Información -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-900 mb-2">
              <strong>ℹ️ Información:</strong>
            </p>
            <ul class="text-xs text-blue-800 space-y-1 ml-4">
              <li>• El archivo Excel es obligatorio</li>
              <li>• Los CVs en PDF son opcionales pero mejoran el análisis</li>
              <li>• El análisis puede tomar 1-2 minutos</li>
              <li>• La API key está configurada en el servidor (seguro)</li>
            </ul>
          </div>

          <!-- Botón de análisis -->
          <div class="flex items-center justify-between pt-4 border-t">
            <div class="text-xs text-gray-500">
              * Campos obligatorios
            </div>
            <button
              (click)="analyzeResumes()"
              [disabled]="loading() || !canAnalyze()"
              [class]="'px-6 py-2 rounded-lg font-medium transition-colors ' +
                       (loading() || !canAnalyze()
                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                         : 'bg-black text-white hover:bg-gray-800')"
            >
              <span *ngIf="!loading()">🚀 Analizar Candidatos</span>
              <span *ngIf="loading()">
                <span class="inline-block animate-spin mr-2">⏳</span>
                Analizando...
              </span>
            </button>
          </div>
        </div>

        <!-- Error -->
        <div *ngIf="error()" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
          <strong>❌ Error:</strong> {{ error() }}
        </div>

        <!-- Loading -->
        <div *ngIf="loading()" class="mt-6">
          <app-loading-spinner></app-loading-spinner>
          <p class="text-center text-sm text-gray-600 mt-4">
            ⏳ Analizando candidatos con IA... Esto puede tomar 1-2 minutos.
          </p>
        </div>
      </div>

      <!-- Resultados -->
      <div *ngIf="analysisResult() && !loading()" class="space-y-6">

        <!-- Botón volver -->
        <button
          (click)="reset()"
          class="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        >
          ← Analizar nuevos candidatos
        </button>

        <!-- Resumen ejecutivo -->
        <div class="bg-white rounded-lg shadow-md p-6" *ngIf="analysisResult() as result">
          <h2 class="text-2xl font-bold mb-4">📊 Resumen Ejecutivo</h2>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-blue-600">{{ result.resumen.totalAnalizados }}</div>
              <div class="text-sm text-gray-600">Total analizados</div>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-green-600">{{ result.resumen.paraEntrevistar }}</div>
              <div class="text-sm text-gray-600">Para entrevistar</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-yellow-600">{{ result.resumen.quizas }}</div>
              <div class="text-sm text-gray-600">Quizás</div>
            </div>
            <div class="bg-red-50 p-4 rounded-lg">
              <div class="text-3xl font-bold text-red-600">{{ result.resumen.descartados }}</div>
              <div class="text-sm text-gray-600">Descartados</div>
            </div>
          </div>

          <!-- TOP 3 -->
          <div class="border-t pt-4">
            <h3 class="font-bold text-lg mb-3">🏆 Top 3 Recomendados</h3>
            <div class="space-y-2">
              <div *ngFor="let top of result.resumen.top3; let i = index"
                   class="flex items-start p-3 bg-gray-50 rounded-lg">
                <div class="flex-shrink-0 w-8 h-8 bg-yellow-400 text-white rounded-full flex items-center justify-center font-bold mr-3">
                  {{ i + 1 }}
                </div>
                <div class="flex-1">
                  <div class="font-semibold">{{ top.nombre }}</div>
                  <div class="text-sm text-gray-600">Score: {{ top.score }}/100</div>
                  <div class="text-sm text-gray-700 mt-1">{{ top.razon }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="bg-white rounded-lg shadow-md p-4" *ngIf="analysisResult() as result">
          <div class="flex flex-wrap gap-2">
            <button
              (click)="filterCategory.set('todos')"
              [class]="'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
                       (filterCategory() === 'todos' ? 'bg-black text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
            >
              Todos ({{ result.candidatos.length }})
            </button>
            <button
              (click)="filterCategory.set('entrevistar')"
              [class]="'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
                       (filterCategory() === 'entrevistar' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
            >
              ✅ Entrevistar ({{ getCandidatesByCategory('entrevistar').length }})
            </button>
            <button
              (click)="filterCategory.set('quizas')"
              [class]="'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
                       (filterCategory() === 'quizas' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
            >
              🤔 Quizás ({{ getCandidatesByCategory('quizas').length }})
            </button>
            <button
              (click)="filterCategory.set('descartar')"
              [class]="'px-4 py-2 rounded-lg text-sm font-medium transition-colors ' +
                       (filterCategory() === 'descartar' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')"
            >
              ❌ Descartar ({{ getCandidatesByCategory('descartar').length }})
            </button>
          </div>
        </div>

        <!-- Lista de candidatos -->
        <div class="space-y-4">
          <div *ngFor="let candidato of getFilteredCandidates()"
               class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">

            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b">
              <div>
                <h3 class="text-xl font-bold text-gray-900">{{ candidato.nombre }}</h3>
                <div class="text-sm text-gray-600 mt-1">
                  <div>📧 {{ candidato.email }}</div>
                  <div>📱 {{ candidato.telefono }}</div>
                </div>
              </div>
              <div class="mt-3 sm:mt-0 flex items-center gap-3">
                <div [class]="'px-4 py-2 rounded-lg font-bold text-center ' + getCategoryClass(candidato.categoria)">
                  {{ getCategoryLabel(candidato.categoria) }}
                </div>
                <div class="text-3xl font-bold text-gray-900">
                  {{ candidato.score }}<span class="text-lg text-gray-500">/100</span>
                </div>
              </div>
            </div>

            <!-- Detalles -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <h4 class="font-semibold text-sm text-gray-700 mb-2">💪 Fortaleza Principal</h4>
                <p class="text-sm text-gray-900">{{ candidato.fortalezaPrincipal }}</p>
              </div>

              <div>
                <h4 class="font-semibold text-sm text-gray-700 mb-2">🚩 Bandera Roja</h4>
                <p class="text-sm text-gray-900">{{ candidato.banderaRoja }}</p>
              </div>

              <div *ngIf="candidato.fortalezas && candidato.fortalezas.length > 0" class="md:col-span-2">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">✨ Fortalezas</h4>
                <ul class="list-disc list-inside text-sm text-gray-900 space-y-1">
                  <li *ngFor="let f of candidato.fortalezas">{{ f }}</li>
                </ul>
              </div>

              <div *ngIf="candidato.areasAtencion && candidato.areasAtencion.length > 0" class="md:col-span-2">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">⚠️ Áreas de Atención</h4>
                <ul class="list-disc list-inside text-sm text-gray-900 space-y-1">
                  <li *ngFor="let a of candidato.areasAtencion">{{ a }}</li>
                </ul>
              </div>

              <div *ngIf="candidato.consistencia" class="md:col-span-2">
                <h4 class="font-semibold text-sm text-gray-700 mb-2">📋 Consistencia CV vs Formulario</h4>
                <p class="text-sm text-gray-900">{{ candidato.consistencia }}</p>
              </div>

              <div *ngIf="candidato.preguntaSugerida" class="md:col-span-2 bg-blue-50 p-4 rounded-lg">
                <h4 class="font-semibold text-sm text-blue-900 mb-2">💬 Pregunta Sugerida para Entrevista</h4>
                <p class="text-sm text-blue-900 italic">"{{ candidato.preguntaSugerida }}"</p>
              </div>
            </div>
          </div>
        </div>

        <!-- No hay candidatos en la categoría seleccionada -->
        <div *ngIf="getFilteredCandidates().length === 0" class="bg-white rounded-lg shadow-md p-12 text-center">
          <p class="text-gray-500">No hay candidatos en esta categoría</p>
        </div>
      </div>
    </div>
  `
})
export class CvAnalysisComponent {
  private cvAnalysisService = inject(CvAnalysisService);

  // Form data
  excelFile = signal<File | null>(null);
  pdfFiles = signal<File[]>([]);

  // State
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  analysisResult = signal<AnalysisResult | null>(null);
  filterCategory = signal<'todos' | 'entrevistar' | 'quizas' | 'descartar'>('todos');

  canAnalyze(): boolean {
    return !!this.excelFile();
  }

  onExcelFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.excelFile.set(file);
      this.error.set(null);
    }
  }

  onPdfFilesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.pdfFiles.set(files);
    this.error.set(null);
  }

  analyzeResumes() {
    if (!this.canAnalyze()) {
      this.error.set('Por favor selecciona un archivo Excel');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    console.log('🚀 Iniciando análisis...');

    // Llamar al servicio del backend
    this.cvAnalysisService.analyzeCV(this.excelFile()!, this.pdfFiles()).subscribe({
      next: (result) => {
        this.analysisResult.set(result);
        this.loading.set(false);

        console.log('✅ Análisis completado:', result);
        console.log(`📊 Total analizados: ${result.resumen.totalAnalizados}`);
        console.log(`✅ Para entrevistar: ${result.resumen.paraEntrevistar}`);
        console.log(`🤔 Quizás: ${result.resumen.quizas}`);
        console.log(`❌ Descartados: ${result.resumen.descartados}`);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.error.set(err.message || 'Error al analizar los CVs. Verifica los archivos.');
        this.loading.set(false);
      }
    });
  }

  reset() {
    this.analysisResult.set(null);
    this.excelFile.set(null);
    this.pdfFiles.set([]);
    this.error.set(null);
    this.filterCategory.set('todos');
  }

  getCandidatesByCategory(category: 'entrevistar' | 'quizas' | 'descartar'): CandidateScore[] {
    return this.analysisResult()?.candidatos.filter(c => c.categoria === category) || [];
  }

  getFilteredCandidates(): CandidateScore[] {
    if (this.filterCategory() === 'todos') {
      return this.analysisResult()?.candidatos || [];
    }
    return this.getCandidatesByCategory(this.filterCategory() as any);
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'entrevistar':
        return 'bg-green-100 text-green-800';
      case 'quizas':
        return 'bg-yellow-100 text-yellow-800';
      case 'descartar':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getCategoryLabel(category: string): string {
    switch (category) {
      case 'entrevistar':
        return '✅ Entrevistar';
      case 'quizas':
        return '🤔 Quizás';
      case 'descartar':
        return '❌ Descartar';
      default:
        return category;
    }
  }
}

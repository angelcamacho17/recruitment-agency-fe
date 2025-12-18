import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CvAnalysisMockService } from '../../core/services/cv-analysis-mock.service';
import { AnalysisResult, CandidateScore, ProgressEvent, FinalResult } from '../../core/models/cv-analysis.model';
import { DemoBannerComponent } from '../../shared/components/demo-banner.component';

@Component({
  selector: 'app-cv-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DemoBannerComponent],
  template: `
    <app-demo-banner></app-demo-banner>
    <div class="p-4 sm:p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
      <!-- Back to home -->
      <button
        routerLink="/"
        class="mb-4 px-4 py-2 bg-white text-gray-700 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
      >
        <span>←</span> Volver al Centro de Agentes
      </button>

      <!-- Compact Header -->
      <div class="flex items-center justify-between max-w-6xl mx-auto mb-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-4xl">🎯</span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">CV Scout</h1>
            <p class="text-sm text-gray-600">Análisis Inteligente de CVs con IA</p>
          </div>
        </div>
        <a
          routerLink="/candidates"
          class="bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
        >
          📊 Ver CVs Guardados
        </a>
      </div>

      <!-- Time Savings Disclaimer -->
      <div class="max-w-6xl mx-auto mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-lg">
        <div class="flex items-center justify-center gap-3 text-center">
          <span class="text-2xl">⏱️</span>
          <p class="font-bold text-lg">77 CVs analizados = ~45 horas humanas ahorradas</p>
          <span class="text-sm opacity-90">(25 min lectura + 10 min evaluación por CV)</span>
        </div>
      </div>

      <!-- Formulario de carga - Compacto -->
      <div *ngIf="!analysisResult() && !loading()" class="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Upload Section -->
          <div class="lg:col-span-2">
            <h2 class="text-xl font-bold text-gray-900 mb-3">Subir CVs para Análisis</h2>
            <input
              type="file"
              accept=".pdf"
              multiple
              (change)="onPdfFilesSelected($event)"
              class="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-blue-600 file:text-white hover:file:from-blue-600 hover:file:to-blue-700 transition-all cursor-pointer mb-3"
            />
            <p class="text-sm text-gray-600 mb-3" *ngIf="pdfFiles().length > 0">
              ✅ {{ pdfFiles().length }} archivo(s) seleccionado(s)
            </p>
            <div *ngIf="pdfFiles().length > 0" class="space-y-1 max-h-32 overflow-y-auto mb-3">
              <div *ngFor="let file of pdfFiles()" class="text-xs text-gray-700 flex items-center bg-blue-50 p-2 rounded">
                <svg class="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"/>
                </svg>
                {{ file.name }}
              </div>
            </div>
            <button
              (click)="analyzeResumes()"
              [disabled]="loading() || !canAnalyze()"
              [class]="'w-full py-3 px-6 rounded-lg font-bold text-base transition-all duration-300 ' +
                       (loading() || !canAnalyze()
                         ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                         : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-105')"
            >
              <span *ngIf="!loading()">🚀 Analizar Candidatos con IA</span>
              <span *ngIf="loading()">
                <span class="inline-block animate-spin mr-2">⏳</span>
                Analizando...
              </span>
            </button>
          </div>

          <!-- Info Section -->
          <div class="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-900 mb-2 font-semibold">💡 Cómo funciona:</p>
            <ul class="text-xs text-blue-800 space-y-1.5">
              <li class="flex items-start">
                <span class="mr-1">•</span>
                <span>Selecciona CVs en PDF</span>
              </li>
              <li class="flex items-start">
                <span class="mr-1">•</span>
                <span>IA analiza automáticamente</span>
              </li>
              <li class="flex items-start">
                <span class="mr-1">•</span>
                <span>Scores y recomendaciones</span>
              </li>
              <li class="flex items-start">
                <span class="mr-1">•</span>
                <span>Análisis en 1-2 minutos</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Error -->
        <div *ngIf="error()" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
          <strong>❌ Error:</strong> {{ error() }}
        </div>
      </div>

      <!-- Progress Section - Compacto -->
      <div *ngIf="loading()" class="bg-white rounded-xl shadow-lg p-6 max-w-6xl mx-auto">
          <h3 class="text-base font-semibold mb-3 flex items-center gap-2">
            <span>{{ getStepIcon(currentStep()) }}</span>
            <span>{{ currentMessage() }}</span>
          </h3>
          <div class="w-full h-6 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div
              class="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 flex items-center justify-center"
              [style.width.%]="progressPercentage()"
            >
              <span *ngIf="progressPercentage() > 10" class="text-white text-xs font-bold">
                {{ progressPercentage() }}%
              </span>
            </div>
          </div>
          <p class="text-center text-xs text-gray-500 mb-3">
            Este proceso puede tomar 1-2 minutos...
          </p>
          <div *ngIf="progressLog().length > 0" class="mt-3">
            <div class="max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-3 space-y-1">
              <div *ngFor="let log of progressLog()" class="flex items-center gap-2 text-xs">
                <span>{{ getStepIcon(log.step) }}</span>
                <p class="flex-1 text-gray-700">{{ log.message }}</p>
                <span class="text-gray-400 text-xs">{{ log.timestamp | date:'HH:mm:ss' }}</span>
              </div>
            </div>
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
  private cvAnalysisService = inject(CvAnalysisMockService);
  private router = inject(Router);

  // Form data
  pdfFiles = signal<File[]>([]);

  // State
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  analysisResult = signal<AnalysisResult | null>(null);
  filterCategory = signal<'todos' | 'entrevistar' | 'quizas' | 'descartar'>('todos');

  // Progress tracking
  currentStep = signal<string>('');
  currentMessage = signal<string>('');
  progressPercentage = signal<number>(0);
  progressLog = signal<ProgressEvent[]>([]);

  canAnalyze(): boolean {
    return this.pdfFiles().length > 0;
  }

  onPdfFilesSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.pdfFiles.set(files);
    this.error.set(null);
  }

  analyzeResumes() {
    if (!this.canAnalyze()) {
      this.error.set('Por favor selecciona al menos un archivo PDF');
      return;
    }

    // Reset state
    this.loading.set(true);
    this.error.set(null);
    this.analysisResult.set(null);
    this.progressLog.set([]);
    this.progressPercentage.set(0);
    this.currentStep.set('');
    this.currentMessage.set('');

    console.log('🚀 Iniciando análisis con progreso en tiempo real...');

    // Create a dummy Excel file for the mock service
    const dummyExcel = new File(['dummy'], 'candidatos.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Usar el método con SSE para progreso en tiempo real
    this.cvAnalysisService.analyzeCVWithProgress(dummyExcel, this.pdfFiles()).subscribe({
      next: (event) => {
        // Verificar si es el evento final
        if ('done' in event) {
          const finalEvent = event as FinalResult;

          if (finalEvent.success && finalEvent.analysis) {
            this.analysisResult.set(finalEvent.analysis);
            this.currentMessage.set('¡Análisis completado exitosamente!');
            this.progressPercentage.set(100);

            console.log('✅ Análisis completado:', finalEvent.analysis);
            console.log(`📊 Total analizados: ${finalEvent.analysis.resumen.totalAnalizados}`);
            console.log(`✅ Para entrevistar: ${finalEvent.analysis.resumen.paraEntrevistar}`);
            console.log(`🤔 Quizás: ${finalEvent.analysis.resumen.quizas}`);
            console.log(`❌ Descartados: ${finalEvent.analysis.resumen.descartados}`);

            // Set notification in localStorage for sidebar
            localStorage.setItem('newAnalysisNotification', 'true');

            // Dispatch custom event to update sidebar
            window.dispatchEvent(new Event('analysisCompleted'));
          } else {
            this.error.set(finalEvent.error || 'Error desconocido en el análisis');
            this.currentMessage.set(`Error: ${finalEvent.error}`);
          }

          this.loading.set(false);
        } else {
          // Evento de progreso
          const progressEvent = event as ProgressEvent;

          this.currentStep.set(progressEvent.step);
          this.currentMessage.set(progressEvent.message);

          // Agregar al log
          const currentLog = this.progressLog();
          this.progressLog.set([...currentLog, progressEvent]);

          // Actualizar porcentaje
          this.updateProgressPercentage(progressEvent);

          console.log(`${this.getStepIcon(progressEvent.step)} ${progressEvent.message}`);
        }
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.error.set(err.message || 'Error al analizar los CVs. Verifica la conexión con el servidor.');
        this.currentMessage.set('Error de conexión');
        this.loading.set(false);
      }
    });
  }

  private updateProgressPercentage(event: ProgressEvent) {
    // Si el evento incluye progreso directo, usarlo
    if (event.progress !== undefined) {
      this.progressPercentage.set(event.progress);
      return;
    }

    // Calcular progreso basado en el step
    const stepProgress: Record<string, number> = {
      'start': 5,
      'upload': 10,
      'excel': 20,
      'pdfs': 50,
      'prompt': 60,
      'claude': 90,
      'cleanup': 95,
      'complete': 100
    };

    const progress = stepProgress[event.step] || this.progressPercentage();
    this.progressPercentage.set(progress);
  }

  getStepIcon(step: string): string {
    const icons: Record<string, string> = {
      'start': '🚀',
      'upload': '📤',
      'excel': '📊',
      'pdfs': '📄',
      'prompt': '✍️',
      'claude': '🤖',
      'cleanup': '🧹',
      'complete': '✅',
      'error': '❌',
      'warning': '⚠️'
    };
    return icons[step] || '📍';
  }

  reset() {
    this.analysisResult.set(null);
    this.pdfFiles.set([]);
    this.error.set(null);
    this.filterCategory.set('todos');
    this.progressLog.set([]);
    this.progressPercentage.set(0);
    this.currentStep.set('');
    this.currentMessage.set('');
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

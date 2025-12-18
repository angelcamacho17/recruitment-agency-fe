import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-talent-matching',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span class="text-6xl">🤝</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Talent Matcher
          </h1>
          <p class="text-xl text-gray-600">
            Matching Inteligente de Talento
          </p>
        </div>

        <!-- Coming Soon Card -->
        <div class="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div class="mb-8">
            <div class="inline-block px-6 py-3 bg-green-100 text-green-700 rounded-full text-lg font-semibold mb-6">
              Próximamente
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Matching con Inteligencia Artificial
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Conecta automáticamente candidatos con las posiciones ideales usando algoritmos
              avanzados de IA. Ahorra tiempo en el proceso de reclutamiento y mejora la
              precisión de tus contrataciones.
            </p>
          </div>

          <!-- Features Preview -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div class="p-6 bg-green-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">🎯</div>
              <h3 class="font-bold text-gray-900 mb-2">Matching Automático</h3>
              <p class="text-gray-600 text-sm">
                Encuentra los mejores candidatos para cada posición en segundos
              </p>
            </div>
            <div class="p-6 bg-green-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">💡</div>
              <h3 class="font-bold text-gray-900 mb-2">Análisis de Compatibilidad</h3>
              <p class="text-gray-600 text-sm">
                Evalúa skills, experiencia y fit cultural automáticamente
              </p>
            </div>
            <div class="p-6 bg-green-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">⚡</div>
              <h3 class="font-bold text-gray-900 mb-2">Proceso Acelerado</h3>
              <p class="text-gray-600 text-sm">
                Reduce el tiempo de reclutamiento hasta en un 70%
              </p>
            </div>
            <div class="p-6 bg-green-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">📋</div>
              <h3 class="font-bold text-gray-900 mb-2">Ranking Inteligente</h3>
              <p class="text-gray-600 text-sm">
                Obtén rankings de candidatos con justificación detallada
              </p>
            </div>
          </div>

          <!-- Back to Home -->
          <div class="mt-12">
            <a
              routerLink="/"
              class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span>←</span>
              Volver al Centro de Agentes
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TalentMatchingComponent {}

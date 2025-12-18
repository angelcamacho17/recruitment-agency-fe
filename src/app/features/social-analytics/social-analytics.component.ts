import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-social-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span class="text-6xl">📊</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Social Pulse
          </h1>
          <p class="text-xl text-gray-600">
            Análisis Inteligente de Redes Sociales
          </p>
        </div>

        <!-- Coming Soon Card -->
        <div class="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div class="mb-8">
            <div class="inline-block px-6 py-3 bg-pink-100 text-pink-700 rounded-full text-lg font-semibold mb-6">
              Próximamente
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Analytics con Inteligencia Artificial
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Analiza tendencias, engagement y rendimiento en redes sociales con IA avanzada.
              Obtén insights accionables para optimizar tu estrategia de contenido y
              mejorar el alcance de tus publicaciones.
            </p>
          </div>

          <!-- Features Preview -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div class="p-6 bg-pink-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">📈</div>
              <h3 class="font-bold text-gray-900 mb-2">Análisis de Tendencias</h3>
              <p class="text-gray-600 text-sm">
                Identifica tendencias emergentes y contenido viral en tiempo real
              </p>
            </div>
            <div class="p-6 bg-pink-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">💬</div>
              <h3 class="font-bold text-gray-900 mb-2">Métricas de Engagement</h3>
              <p class="text-gray-600 text-sm">
                Mide y optimiza la interacción con tu audiencia
              </p>
            </div>
            <div class="p-6 bg-pink-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">🎯</div>
              <h3 class="font-bold text-gray-900 mb-2">Segmentación de Audiencia</h3>
              <p class="text-gray-600 text-sm">
                Comprende mejor a tu audiencia y sus preferencias
              </p>
            </div>
            <div class="p-6 bg-pink-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">📊</div>
              <h3 class="font-bold text-gray-900 mb-2">Reportes Automatizados</h3>
              <p class="text-gray-600 text-sm">
                Genera reportes detallados de rendimiento automáticamente
              </p>
            </div>
          </div>

          <!-- Back to Home -->
          <div class="mt-12">
            <a
              routerLink="/"
              class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
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
export class SocialAnalyticsComponent {}

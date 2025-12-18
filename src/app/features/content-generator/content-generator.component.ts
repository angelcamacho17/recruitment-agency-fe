import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-content-generator',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6">
      <div class="max-w-4xl mx-auto">
        <!-- Back to Home -->
        <button
          routerLink="/"
          class="mb-6 px-4 py-2 bg-white text-gray-700 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span>←</span> Volver al Centro de Agentes
        </button>

        <!-- Header -->
        <div class="text-center mb-12">
          <div class="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span class="text-6xl">✨</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Content Genius
          </h1>
          <p class="text-xl text-gray-600">
            Generador de Contenido Inteligente con IA
          </p>
        </div>

        <!-- Coming Soon Card -->
        <div class="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div class="mb-8">
            <div class="inline-block px-6 py-3 bg-purple-100 text-purple-700 rounded-full text-lg font-semibold mb-6">
              Próximamente
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">
              Creación de Contenido con Contexto de Marca
            </h2>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
              Esta herramienta revolucionaria aprenderá todo sobre tu marca, tu voz, tu audiencia y tus valores para generar contenido que realmente te represente.
            </p>
            <p class="text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
              No más contenido genérico. Content Genius comprenderá profundamente tu contexto empresarial,
              tu industria, tu competencia y tus objetivos para crear posts, emails y copys que suenen
              auténticos y conecten genuinamente con tu audiencia.
            </p>
          </div>

          <!-- Features Preview -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div class="p-6 bg-purple-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">🧠</div>
              <h3 class="font-bold text-gray-900 mb-2">Aprende tu Marca</h3>
              <p class="text-gray-600 text-sm">
                Analiza tu sitio web, contenido existente y documentos de marca para entender tu voz única
              </p>
            </div>
            <div class="p-6 bg-purple-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">🎯</div>
              <h3 class="font-bold text-gray-900 mb-2">Contexto Completo</h3>
              <p class="text-gray-600 text-sm">
                Comprende tu industria, competidores, audiencia objetivo y posicionamiento de mercado
              </p>
            </div>
            <div class="p-6 bg-purple-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">✍️</div>
              <h3 class="font-bold text-gray-900 mb-2">Contenido Auténtico</h3>
              <p class="text-gray-600 text-sm">
                Genera posts, emails y copys que suenan exactamente como tu marca, no como IA genérica
              </p>
            </div>
            <div class="p-6 bg-purple-50 rounded-2xl text-left">
              <div class="text-3xl mb-3">📱</div>
              <h3 class="font-bold text-gray-900 mb-2">Multi-Plataforma</h3>
              <p class="text-gray-600 text-sm">
                Adapta automáticamente el tono y formato para LinkedIn, Instagram, Facebook, Twitter y más
              </p>
            </div>
          </div>

          <!-- Back to Home -->
          <div class="mt-12">
            <a
              routerLink="/"
              class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
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
export class ContentGeneratorComponent {}

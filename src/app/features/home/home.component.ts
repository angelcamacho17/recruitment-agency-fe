import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface AIAgent {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  gradient: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      <!-- Hero Section -->
      <div class="px-4 sm:px-6 lg:px-8 py-12">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-16">
            <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Centro de <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-700">Agentes IA</span>
            </h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto">
              Potencia tu agencia de reclutamiento y marketing con inteligencia artificial de última generación
            </p>
          </div>
      
          <!-- Stats Section -->
          <div class="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
              <div class="text-4xl font-bold text-primary-600 mb-2">{{ agents.length }}</div>
              <div class="text-gray-600 font-medium">Agentes IA</div>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
              <div class="text-4xl font-bold text-primary-600 mb-2">77</div>
              <div class="text-gray-600 font-medium">CVs Analizados</div>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
              <div class="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div class="text-gray-600 font-medium">Disponibilidad</div>
            </div>
            <div class="bg-white rounded-2xl p-6 shadow-lg text-center transform hover:scale-105 transition-transform duration-300">
              <div class="text-4xl font-bold text-primary-600 mb-2">100%</div>
              <div class="text-gray-600 font-medium">IA Powered</div>
            </div>
          </div>

          <!-- Agent Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div
              *ngFor="let agent of agents"
              [routerLink]="agent.route"
              class="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2"
            >
              <!-- Gradient Background -->
              <div [class]="'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ' + agent.gradient"></div>

              <!-- Content -->
              <div class="relative p-8">
                <!-- Icon -->
                <div [class]="'w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 ' + agent.color">
                  <span class="text-4xl">{{ agent.icon }}</span>
                </div>

                <!-- Title -->
                <h3 class="text-2xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                  {{ agent.title }}
                </h3>

                <!-- Name Badge -->
                <div class="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4 group-hover:bg-white group-hover:text-primary-600 transition-colors duration-300">
                  {{ agent.name }}
                </div>

                <!-- Description -->
                <p class="text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                  {{ agent.description }}
                </p>

                <!-- Arrow Icon -->
                <div class="absolute bottom-6 right-6 text-primary-500 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-2">
                  <span class="text-3xl">→</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  agents: AIAgent[] = [
    {
      id: 'cv-scout',
      name: 'CV Scout',
      title: 'Análisis Inteligente de CVs',
      description: 'Analiza y evalúa candidatos automáticamente usando IA avanzada. Obtén scores, fortalezas y recomendaciones en segundos. 77 CVs analizados = ~38.5 horas humanas ahorradas (30 min/CV).',
      icon: '🎯',
      route: '/cv-analysis',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500/90 to-blue-700/90'
    },
    {
      id: 'talent-matcher',
      name: 'Talent Matcher',
      title: 'Matching Inteligente',
      description: 'Conecta automáticamente candidatos con posiciones ideales usando algoritmos de IA. 77 CVs matcheados = ~25.5 horas humanas ahorradas (20 min/CV).',
      icon: '🤝',
      route: '/talent-matching',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      gradient: 'bg-gradient-to-br from-green-500/90 to-green-700/90'
    },
    {
      id: 'content-genius',
      name: 'Content Genius',
      title: 'Generador de Contenido',
      description: 'Crea contenido personalizado que refleja tu marca. IA que aprende tu voz, audiencia y valores para contenido auténtico.',
      icon: '✨',
      route: '/content-generator',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500/90 to-purple-700/90'
    }
  ];
}

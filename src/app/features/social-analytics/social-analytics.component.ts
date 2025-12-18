import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface AnalyticsData {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  topPost: string;
  bestTime: string;
  sentiment: string;
  trending: string[];
}

@Component({
  selector: 'app-social-analytics',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Back to Home -->
        <button
          routerLink="/"
          class="mb-6 px-4 py-2 bg-white text-gray-700 rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span>←</span> Volver al Centro de Agentes
        </button>

        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-24 h-24 bg-gradient-to-br from-pink-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span class="text-6xl">📊</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Social Pulse
          </h1>
          <p class="text-xl text-gray-600">
            Análisis Inteligente de Redes Sociales con IA
          </p>
        </div>

        <!-- Demo Analytics -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Analiza el Rendimiento de tus Redes</h2>

          <!-- Platform Selection -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button
              *ngFor="let p of platforms"
              (click)="selectPlatform(p)"
              [class]="'p-4 rounded-xl font-semibold transition-all ' +
                       (selectedPlatform === p
                         ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-xl scale-105'
                         : 'bg-pink-50 text-pink-700 hover:bg-pink-100')"
            >
              {{ getPlatformIcon(p) }} {{ p }}
            </button>
          </div>

          <!-- Analyze Button -->
          <button
            (click)="analyzeAccount()"
            [disabled]="loading()"
            [class]="'w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ' +
                     (loading()
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                       : 'bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 hover:shadow-xl hover:scale-105')"
          >
            <span *ngIf="!loading()">📊 Analizar Rendimiento con IA</span>
            <span *ngIf="loading()">
              <span class="inline-block animate-spin mr-2">⏳</span>
              Analizando datos...
            </span>
          </button>
        </div>

        <!-- Analytics Results -->
        <div *ngIf="analytics()" class="space-y-6">
          <!-- Overview Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-2xl shadow-xl p-6 text-center">
              <div class="text-4xl font-bold text-pink-600 mb-2">{{ formatNumber(analytics()!.followers) }}</div>
              <div class="text-sm text-gray-600">Seguidores</div>
              <div class="text-xs text-green-600 mt-1">+12% este mes</div>
            </div>
            <div class="bg-white rounded-2xl shadow-xl p-6 text-center">
              <div class="text-4xl font-bold text-pink-600 mb-2">{{ analytics()!.engagement }}%</div>
              <div class="text-sm text-gray-600">Engagement Rate</div>
              <div class="text-xs text-green-600 mt-1">+5% vs mes anterior</div>
            </div>
            <div class="bg-white rounded-2xl shadow-xl p-6 text-center">
              <div class="text-4xl font-bold text-pink-600 mb-2">{{ formatNumber(analytics()!.reach) }}</div>
              <div class="text-sm text-gray-600">Alcance</div>
              <div class="text-xs text-green-600 mt-1">+18% esta semana</div>
            </div>
            <div class="bg-white rounded-2xl shadow-xl p-6 text-center">
              <div class="text-4xl font-bold text-pink-600 mb-2">{{ formatNumber(analytics()!.impressions) }}</div>
              <div class="text-sm text-gray-600">Impresiones</div>
              <div class="text-xs text-green-600 mt-1">+22% este mes</div>
            </div>
          </div>

          <!-- Detailed Insights -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Best Performance -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🏆</span> Mejor Rendimiento
              </h3>
              <div class="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 mb-4">
                <p class="text-sm text-gray-700 mb-2">Post con más engagement:</p>
                <p class="font-semibold text-gray-900">"{{ analytics()!.topPost }}"</p>
                <div class="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div class="text-lg font-bold text-pink-600">{{ getRandomNumber(200, 500) }}</div>
                    <div class="text-xs text-gray-600">Likes</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-pink-600">{{ getRandomNumber(50, 150) }}</div>
                    <div class="text-xs text-gray-600">Comentarios</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-pink-600">{{ getRandomNumber(30, 80) }}</div>
                    <div class="text-xs text-gray-600">Compartidos</div>
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-700">
                <p class="mb-2"><strong>Mejor horario:</strong> {{ analytics()!.bestTime }}</p>
                <p><strong>Sentimiento:</strong>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold"
                        [class]="getSentimentClass(analytics()!.sentiment)">
                    {{ analytics()!.sentiment }}
                  </span>
                </p>
              </div>
            </div>

            <!-- Trending Topics -->
            <div class="bg-white rounded-2xl shadow-xl p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔥</span> Tendencias y Hashtags
              </h3>
              <div class="space-y-3">
                <div *ngFor="let trend of analytics()!.trending; let i = index"
                     class="flex items-center justify-between p-3 bg-pink-50 rounded-xl">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {{ i + 1 }}
                    </div>
                    <span class="font-semibold text-gray-900">#{{ trend }}</span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ getRandomNumber(1000, 10000) }} menciones
                  </div>
                </div>
              </div>
              <div class="mt-4 p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl">
                <p class="text-sm text-gray-700">
                  💡 <strong>Recomendación IA:</strong> Aumenta el uso de #{{ analytics()!.trending[0] }}
                  para maximizar alcance esta semana
                </p>
              </div>
            </div>
          </div>

          <!-- Audience Insights -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>👥</span> Insights de Audiencia
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 class="font-semibold text-gray-700 mb-3">Demografía</h4>
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">25-34 años</span>
                    <div class="flex items-center gap-2">
                      <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-pink-500" style="width: 45%"></div>
                      </div>
                      <span class="text-sm font-semibold">45%</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">35-44 años</span>
                    <div class="flex items-center gap-2">
                      <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-pink-500" style="width: 30%"></div>
                      </div>
                      <span class="text-sm font-semibold">30%</span>
                    </div>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">18-24 años</span>
                    <div class="flex items-center gap-2">
                      <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-pink-500" style="width: 25%"></div>
                      </div>
                      <span class="text-sm font-semibold">25%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="font-semibold text-gray-700 mb-3">Ubicación Principal</h4>
                <div class="space-y-2">
                  <div class="flex justify-between p-2 bg-pink-50 rounded-lg">
                    <span class="text-sm">🇪🇸 España</span>
                    <span class="text-sm font-semibold">38%</span>
                  </div>
                  <div class="flex justify-between p-2 bg-pink-50 rounded-lg">
                    <span class="text-sm">🇲🇽 México</span>
                    <span class="text-sm font-semibold">24%</span>
                  </div>
                  <div class="flex justify-between p-2 bg-pink-50 rounded-lg">
                    <span class="text-sm">🇺🇸 USA</span>
                    <span class="text-sm font-semibold">18%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="font-semibold text-gray-700 mb-3">Actividad</h4>
                <div class="space-y-2">
                  <div class="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <div class="text-2xl font-bold text-pink-600">18:00 - 21:00</div>
                    <div class="text-xs text-gray-600">Horario pico de actividad</div>
                  </div>
                  <div class="p-3 bg-pink-50 rounded-lg">
                    <div class="text-lg font-bold text-pink-600">Martes y Jueves</div>
                    <div class="text-xs text-gray-600">Mejores días para publicar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Recommendations -->
          <div class="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-4 flex items-center gap-2">
              <span>🤖</span> Recomendaciones IA
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white/20 backdrop-blur rounded-xl p-4">
                <div class="font-semibold mb-2">✨ Optimiza tu contenido</div>
                <div class="text-sm opacity-90">
                  Los posts con imágenes obtienen 2.3x más engagement. Incluye contenido visual en todas tus publicaciones.
                </div>
              </div>
              <div class="bg-white/20 backdrop-blur rounded-xl p-4">
                <div class="font-semibold mb-2">⏰ Mejor timing</div>
                <div class="text-sm opacity-90">
                  Publica entre 18:00-21:00 los martes y jueves para maximizar alcance y engagement.
                </div>
              </div>
              <div class="bg-white/20 backdrop-blur rounded-xl p-4">
                <div class="font-semibold mb-2">💬 Aumenta interacción</div>
                <div class="text-sm opacity-90">
                  Haz preguntas directas en tus posts. Los posts con preguntas reciben 50% más comentarios.
                </div>
              </div>
              <div class="bg-white/20 backdrop-blur rounded-xl p-4">
                <div class="font-semibold mb-2">🎯 Hashtags estratégicos</div>
                <div class="text-sm opacity-90">
                  Usa 5-7 hashtags relevantes. Combina hashtags populares (#{{ analytics()!.trending[0] }}) con nichos específicos.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SocialAnalyticsComponent {
  platforms = ['LinkedIn', 'Instagram', 'Facebook', 'Twitter'];
  selectedPlatform = 'LinkedIn';

  loading = signal(false);
  analytics = signal<AnalyticsData | null>(null);

  private mockData: Record<string, AnalyticsData> = {
    'LinkedIn': {
      platform: 'LinkedIn',
      followers: 15420,
      engagement: 8.5,
      reach: 45200,
      impressions: 123500,
      topPost: 'Transformando el reclutamiento con IA: 5 tendencias clave',
      bestTime: 'Martes 18:00 - 20:00',
      sentiment: 'Muy Positivo (92%)',
      trending: ['Hiring', 'AI', 'TechJobs', 'RemoteWork', 'Innovation']
    },
    'Instagram': {
      platform: 'Instagram',
      followers: 28350,
      engagement: 12.3,
      reach: 78500,
      impressions: 245000,
      topPost: '¿Buscas tu próximo desafío? Estamos contratando talento tech',
      bestTime: 'Lunes y Jueves 19:00 - 21:00',
      sentiment: 'Positivo (88%)',
      trending: ['WeAreHiring', 'TechTalent', 'DreamJob', 'CareerGoals', 'WorkLife']
    },
    'Facebook': {
      platform: 'Facebook',
      followers: 12890,
      engagement: 6.8,
      reach: 32100,
      impressions: 89000,
      topPost: 'Consejos para destacar en tu próxima entrevista de trabajo',
      bestTime: 'Miércoles 17:00 - 19:00',
      sentiment: 'Positivo (85%)',
      trending: ['Jobs', 'Recruitment', 'Career', 'Professional', 'Hiring']
    },
    'Twitter': {
      platform: 'Twitter',
      followers: 9560,
      engagement: 5.2,
      reach: 28900,
      impressions: 67000,
      topPost: 'La IA está revolucionando cómo encontramos talento. Thread 🧵',
      bestTime: 'Martes 12:00 - 14:00',
      sentiment: 'Neutral-Positivo (78%)',
      trending: ['Tech', 'AIRecruiting', 'FutureOfWork', 'HRTech', 'Jobs']
    }
  };

  selectPlatform(platform: string) {
    this.selectedPlatform = platform;
    this.analytics.set(null);
  }

  analyzeAccount() {
    this.loading.set(true);
    this.analytics.set(null);

    // Simulate AI analysis
    setTimeout(() => {
      this.analytics.set(this.mockData[this.selectedPlatform]);
      this.loading.set(false);
    }, 2000);
  }

  getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      'LinkedIn': '💼',
      'Instagram': '📸',
      'Facebook': '👥',
      'Twitter': '🐦'
    };
    return icons[platform] || '📱';
  }

  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getSentimentClass(sentiment: string): string {
    if (sentiment.includes('Muy Positivo')) {
      return 'bg-green-100 text-green-700';
    }
    if (sentiment.includes('Positivo')) {
      return 'bg-blue-100 text-blue-700';
    }
    return 'bg-yellow-100 text-yellow-700';
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

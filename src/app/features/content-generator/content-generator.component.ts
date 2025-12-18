import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface GeneratedContent {
  platform: string;
  content: string;
  hashtags: string[];
  tone: string;
}

@Component({
  selector: 'app-content-generator',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 p-6">
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

        <!-- Demo Content Generator -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Genera Contenido para Redes Sociales</h2>

          <!-- Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tema del Contenido</label>
              <input
                type="text"
                [(ngModel)]="topic"
                placeholder="Ej: Nueva posición de desarrollador Full Stack"
                class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Plataforma</label>
              <select
                [(ngModel)]="platform"
                class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="linkedin">LinkedIn</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter/X</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tono</label>
              <select
                [(ngModel)]="tone"
                class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="profesional">Profesional</option>
                <option value="casual">Casual</option>
                <option value="inspirador">Inspirador</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Objetivo</label>
              <select
                [(ngModel)]="objective"
                class="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
              >
                <option value="recrutar">Reclutar Talento</option>
                <option value="promocionar">Promocionar Servicio</option>
                <option value="engagement">Aumentar Engagement</option>
                <option value="branding">Fortalecer Marca</option>
              </select>
            </div>
          </div>

          <!-- Generate Button -->
          <button
            (click)="generateContent()"
            [disabled]="loading() || !topic"
            [class]="'w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ' +
                     (loading() || !topic
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                       : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 hover:shadow-xl hover:scale-105')"
          >
            <span *ngIf="!loading()">✨ Generar Contenido con IA</span>
            <span *ngIf="loading()">
              <span class="inline-block animate-spin mr-2">⏳</span>
              Generando contenido mágico...
            </span>
          </button>
        </div>

        <!-- Generated Content Results -->
        <div *ngIf="generatedContent()" class="bg-white rounded-3xl shadow-2xl p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Contenido Generado</h3>
            <div class="flex gap-2">
              <button
                (click)="copyToClipboard()"
                class="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-semibold"
              >
                📋 Copiar
              </button>
              <button
                (click)="reset()"
                class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold"
              >
                🔄 Nuevo
              </button>
            </div>
          </div>

          <!-- Platform Badge -->
          <div class="mb-4">
            <span class="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold">
              {{ getPlatformIcon(generatedContent()!.platform) }} {{ getPlatformName(generatedContent()!.platform) }}
            </span>
            <span class="ml-2 inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              Tono: {{ generatedContent()!.tone }}
            </span>
          </div>

          <!-- Content -->
          <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 mb-4">
            <p class="text-gray-900 text-lg whitespace-pre-line leading-relaxed">{{ generatedContent()!.content }}</p>
          </div>

          <!-- Hashtags -->
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let tag of generatedContent()!.hashtags" class="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-semibold">
              #{{ tag }}
            </span>
          </div>

          <!-- Stats Preview -->
          <div class="mt-6 grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-purple-50 rounded-xl">
              <div class="text-2xl font-bold text-purple-600">{{ getRandomNumber(80, 95) }}%</div>
              <div class="text-xs text-gray-600">Engagement Esperado</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-xl">
              <div class="text-2xl font-bold text-purple-600">{{ getRandomNumber(500, 2000) }}</div>
              <div class="text-xs text-gray-600">Alcance Estimado</div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-xl">
              <div class="text-2xl font-bold text-purple-600">{{ getRandomNumber(30, 100) }}</div>
              <div class="text-xs text-gray-600">Interacciones Previstas</div>
            </div>
          </div>
        </div>

        <!-- Success Message -->
        <div *ngIf="copied()" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-bounce">
          ✅ ¡Contenido copiado al portapapeles!
        </div>
      </div>
    </div>
  `
})
export class ContentGeneratorComponent {
  topic = '';
  platform = 'linkedin';
  tone = 'profesional';
  objective = 'recrutar';

  loading = signal(false);
  generatedContent = signal<GeneratedContent | null>(null);
  copied = signal(false);

  private contentTemplates: Record<string, Record<string, string>> = {
    linkedin: {
      recrutar: `🎯 ¡Estamos buscando talento excepcional!

{topic}

En nuestra agencia, no solo buscamos profesionales con habilidades técnicas sobresalientes, sino personas apasionadas que quieran crecer y hacer la diferencia.

✨ ¿Qué ofrecemos?
• Ambiente de trabajo colaborativo y dinámico
• Proyectos desafiantes con tecnologías de vanguardia
• Oportunidades de desarrollo profesional
• Equipo multicultural y diverso

¿Te interesa? ¡Envía tu CV! Estamos ansiosos por conocerte.`,
      promocionar: `💼 Transformamos tu proceso de reclutamiento con IA

{topic}

Nuestra plataforma revoluciona cómo las empresas encuentran y evalúan talento:

🚀 Análisis inteligente de CVs en segundos
📊 Matching automatizado candidato-posición
✨ Generación de contenido para campañas
📈 Analytics predictivo de contratación

El futuro del reclutamiento ya está aquí. ¿Listo para la transformación?`,
      engagement: `🌟 El talento adecuado hace toda la diferencia

{topic}

En el mundo actual, encontrar el candidato perfecto es más que revisar CVs. Es sobre:

💡 Entender habilidades blandas y técnicas
🎯 Evaluar fit cultural
🚀 Identificar potencial de crecimiento
❤️ Conectar con valores de la empresa

¿Cuál es tu mayor desafío en reclutamiento? Comparte tu experiencia 👇`,
      branding: `🏆 Redefiniendo el Reclutamiento con Inteligencia Artificial

{topic}

Somos más que una agencia de reclutamiento. Somos tu socio estratégico en la búsqueda del talento que impulsa el crecimiento.

Nuestra misión: Conectar a las mejores empresas con los mejores profesionales, usando tecnología de punta e inteligencia artificial.

Únete a nuestra comunidad de innovadores. El futuro del trabajo empieza aquí.`
    },
    instagram: {
      recrutar: `✨ TU PRÓXIMO GRAN PASO ESTÁ AQUÍ ✨

{topic}

🎯 ¿Listo para el desafío?
💼 Ambiente increíble
🚀 Proyectos innovadores
❤️ Equipo apasionado

¡DM para más info! 📩`,
      promocionar: `🤖 IA + RECLUTAMIENTO = MAGIA ✨

{topic}

Descubre cómo la tecnología está transformando la forma de contratar talento 🚀

👉 Swipe para ver más
💬 Comenta "INFO" para detalles`,
      engagement: `💭 PREGUNTA DEL DÍA 💭

{topic}

¿Cuál es la habilidad más importante que buscas en un candidato?

A) Habilidades técnicas 💻
B) Soft skills 🤝
C) Experiencia 📊
D) Actitud 🌟

¡Comenta tu respuesta! 👇`,
      branding: `🌟 SOMOS MÁS QUE RECLUTAMIENTO 🌟

{topic}

Conectamos talento con oportunidades usando:
• Inteligencia Artificial 🤖
• Análisis Predictivo 📊
• Matching Perfecto 🎯

El futuro del trabajo, hoy. 🚀`
    },
    facebook: {
      recrutar: `🎉 ¡Oportunidad Increíble de Empleo!

{topic}

Buscamos personas talentosas que quieran formar parte de nuestro equipo.

✅ Lo que ofrecemos:
• Excelente ambiente laboral
• Crecimiento profesional
• Proyectos emocionantes
• Equipo colaborativo

¿Interesado? ¡Envíanos tu CV por mensaje!

👉 Comparte con alguien que pueda estar interesado`,
      promocionar: `💼 ¿Cansado de procesos de reclutamiento lentos?

{topic}

Nuestra plataforma de IA revoluciona cómo contratas:

⚡ Análisis de CVs en segundos
🎯 Matching automatizado
📊 Reportes detallados
✨ Recomendaciones inteligentes

Agenda una demo gratuita y descubre la diferencia.

👉 Más información en el link de la bio`,
      engagement: `🤔 Encuesta Rápida

{topic}

¿Qué es lo más difícil del proceso de reclutamiento?

Reacciona con:
👍 Encontrar candidatos calificados
❤️ Evaluar habilidades técnicas
😮 Verificar referencias
😢 Negociación salarial

¡Queremos saber tu opinión!`,
      branding: `🚀 Innovación en Reclutamiento

{topic}

Combinamos experiencia humana con inteligencia artificial para transformar la forma en que las empresas encuentran talento.

✨ Nuestra misión: Hacer que cada contratación sea la correcta.

Únete a más de 500 empresas que confían en nosotros.`
    },
    twitter: {
      recrutar: `🎯 ¡Estamos contratando!

{topic}

Buscamos talento apasionado para unirse a nuestro equipo 🚀

💼 Ambiente innovador
✨ Proyectos desafiantes
🌟 Crecimiento garantizado

DM para detalles 📩`,
      promocionar: `⚡ La IA está revolucionando el reclutamiento

{topic}

Analiza CVs en segundos, no en horas
Encuentra el match perfecto automáticamente
Toma decisiones basadas en datos

El futuro ya llegó 🚀`,
      engagement: `💭 Pregunta rápida:

{topic}

¿Cuánto tiempo pasas revisando CVs cada semana?

La IA puede reducirlo en un 90%

¿Interesado en saber cómo? 👇`,
      branding: `🏆 Reclutamiento + IA = Éxito

{topic}

Conectamos empresas con talento excepcional usando tecnología de vanguardia

Únete a la revolución del reclutamiento 🚀`
    }
  };

  generateContent() {
    if (!this.topic.trim()) return;

    this.loading.set(true);
    this.generatedContent.set(null);

    // Simulate AI processing
    setTimeout(() => {
      const template = this.contentTemplates[this.platform][this.objective];
      const content = template.replace('{topic}', this.topic);

      const hashtags = this.generateHashtags();

      this.generatedContent.set({
        platform: this.platform,
        content: content,
        hashtags: hashtags,
        tone: this.tone
      });

      this.loading.set(false);
    }, 2000);
  }

  private generateHashtags(): string[] {
    const baseHashtags: Record<string, string[]> = {
      recrutar: ['Hiring', 'JobOpportunity', 'WeAreHiring', 'JoinOurTeam', 'CareerGrowth'],
      promocionar: ['AI', 'Recruitment', 'HRTech', 'Innovation', 'FutureOfWork'],
      engagement: ['HR', 'Recruiting', 'TalentAcquisition', 'Hiring', 'WorkCulture'],
      branding: ['Leadership', 'Innovation', 'Technology', 'Growth', 'Success']
    };

    return baseHashtags[this.objective].slice(0, 5);
  }

  getPlatformIcon(platform: string): string {
    const icons: Record<string, string> = {
      linkedin: '💼',
      instagram: '📸',
      facebook: '👥',
      twitter: '🐦'
    };
    return icons[platform] || '📱';
  }

  getPlatformName(platform: string): string {
    const names: Record<string, string> = {
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      facebook: 'Facebook',
      twitter: 'Twitter/X'
    };
    return names[platform] || platform;
  }

  copyToClipboard() {
    if (!this.generatedContent()) return;

    const content = this.generatedContent()!;
    const fullText = `${content.content}\n\n${content.hashtags.map(tag => '#' + tag).join(' ')}`;

    navigator.clipboard.writeText(fullText).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 3000);
    });
  }

  reset() {
    this.generatedContent.set(null);
    this.topic = '';
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  seniority: string;
  skills: string[];
}

interface CandidateMatch {
  name: string;
  matchScore: number;
  email: string;
  phone: string;
  skills: string[];
  experience: string;
  strengths: string[];
  concerns: string[];
  recommendation: string;
}

@Component({
  selector: 'app-talent-matching',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 p-6">
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
          <div class="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span class="text-6xl">🤝</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Talent Matcher
          </h1>
          <p class="text-xl text-gray-600">
            Matching Inteligente de Talento con IA
          </p>
        </div>

        <!-- Job Selection -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Selecciona la Posición Vacante</h2>

          <!-- Position Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div
              *ngFor="let job of jobPositions"
              (click)="selectJob(job)"
              [class]="'p-6 rounded-xl border-2 cursor-pointer transition-all ' +
                       (selectedJob?.id === job.id
                         ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 shadow-xl scale-105'
                         : 'border-gray-200 hover:border-green-300 hover:bg-green-50')"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="text-lg font-bold text-gray-900">{{ job.title }}</h3>
                  <p class="text-sm text-gray-600">{{ job.department }}</p>
                </div>
                <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  {{ job.seniority }}
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span *ngFor="let skill of job.skills.slice(0, 3)" class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {{ skill }}
                </span>
                <span *ngIf="job.skills.length > 3" class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  +{{ job.skills.length - 3 }}
                </span>
              </div>
            </div>
          </div>

          <!-- Find Matches Button -->
          <button
            (click)="findMatches()"
            [disabled]="!selectedJob || loading()"
            [class]="'w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 ' +
                     (!selectedJob || loading()
                       ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                       : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:scale-105')"
          >
            <span *ngIf="!loading()">🤝 Encontrar Candidatos Ideales con IA</span>
            <span *ngIf="loading()">
              <span class="inline-block animate-spin mr-2">⏳</span>
              Analizando base de datos de candidatos...
            </span>
          </button>
        </div>

        <!-- Matching Results -->
        <div *ngIf="matches().length > 0" class="space-y-6">
          <!-- Summary -->
          <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-8 text-white">
            <h3 class="text-2xl font-bold mb-4">📊 Resumen de Matching</h3>
            <div class="grid grid-cols-3 gap-6">
              <div class="text-center">
                <div class="text-4xl font-bold">{{ matches().length }}</div>
                <div class="text-sm opacity-90">Candidatos Analizados</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold">{{ getTopMatches().length }}</div>
                <div class="text-sm opacity-90">Matches Excepcionales (>85%)</div>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold">{{ matches()[0].matchScore }}%</div>
                <div class="text-sm opacity-90">Mejor Match</div>
              </div>
            </div>
          </div>

          <!-- Top Matches -->
          <div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">🏆 Mejores Candidatos</h3>
            <div class="space-y-4">
              <div
                *ngFor="let match of matches(); let i = index"
                class="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
              >
                <!-- Header -->
                <div class="flex items-start justify-between mb-4 pb-4 border-b">
                  <div class="flex items-start gap-4">
                    <!-- Rank Badge -->
                    <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg"
                         [class]="getRankBadgeClass(i)">
                      {{ i + 1 }}
                    </div>
                    <!-- Candidate Info -->
                    <div>
                      <h4 class="text-xl font-bold text-gray-900">{{ match.name }}</h4>
                      <p class="text-sm text-gray-600">📧 {{ match.email }}</p>
                      <p class="text-sm text-gray-600">📱 {{ match.phone }}</p>
                    </div>
                  </div>
                  <!-- Match Score -->
                  <div class="text-center">
                    <div class="relative w-24 h-24">
                      <svg class="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#e5e7eb" stroke-width="8" fill="none"/>
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          [attr.stroke]="getScoreColor(match.matchScore)"
                          stroke-width="8"
                          fill="none"
                          [attr.stroke-dasharray]="251.2"
                          [attr.stroke-dashoffset]="251.2 - (251.2 * match.matchScore / 100)"
                        />
                      </svg>
                      <div class="absolute inset-0 flex items-center justify-center">
                        <div class="text-center">
                          <div class="text-2xl font-bold" [style.color]="getScoreColor(match.matchScore)">
                            {{ match.matchScore }}%
                          </div>
                          <div class="text-xs text-gray-500">Match</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Details -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Left Column -->
                  <div class="space-y-4">
                    <div>
                      <h5 class="font-semibold text-gray-700 mb-2">💼 Experiencia</h5>
                      <p class="text-gray-900">{{ match.experience }}</p>
                    </div>
                    <div>
                      <h5 class="font-semibold text-gray-700 mb-2">🎯 Skills Matching</h5>
                      <div class="flex flex-wrap gap-2">
                        <span *ngFor="let skill of match.skills" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {{ skill }}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h5 class="font-semibold text-gray-700 mb-2">✨ Fortalezas</h5>
                      <ul class="list-disc list-inside text-sm text-gray-900 space-y-1">
                        <li *ngFor="let strength of match.strengths">{{ strength }}</li>
                      </ul>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="space-y-4">
                    <div>
                      <h5 class="font-semibold text-gray-700 mb-2">⚠️ Puntos de Atención</h5>
                      <ul class="list-disc list-inside text-sm text-gray-900 space-y-1">
                        <li *ngFor="let concern of match.concerns">{{ concern }}</li>
                      </ul>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                      <h5 class="font-semibold text-gray-700 mb-2">🤖 Recomendación IA</h5>
                      <p class="text-sm text-gray-900">{{ match.recommendation }}</p>
                    </div>
                    <div class="flex gap-2">
                      <button class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold">
                        📧 Contactar
                      </button>
                      <button class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                        📄 Ver CV Completo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Insights -->
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🧠</span> Insights del Matching IA
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <h4 class="font-bold text-gray-900 mb-3">📊 Análisis de Mercado</h4>
                <p class="text-sm text-gray-700 mb-2">
                  Basado en nuestra base de datos de 15,000+ candidatos tech:
                </p>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li>• Competencia por este perfil: <strong class="text-green-700">Alta</strong></li>
                  <li>• Disponibilidad en el mercado: <strong class="text-green-700">Media</strong></li>
                  <li>• Rango salarial esperado: <strong class="text-green-700">$70K - $95K</strong></li>
                </ul>
              </div>
              <div class="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <h4 class="font-bold text-gray-900 mb-3">💡 Recomendaciones</h4>
                <ul class="text-sm text-gray-700 space-y-2">
                  <li>✓ Contacta a los top 3 candidatos en las próximas 48h</li>
                  <li>✓ Destaca cultura de trabajo remoto en la propuesta</li>
                  <li>✓ Prepara preguntas técnicas sobre microservicios</li>
                  <li>✓ Considera ofrecer equity como diferenciador</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TalentMatchingComponent {
  jobPositions: JobPosition[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      seniority: 'Senior',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL']
    },
    {
      id: '2',
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      seniority: 'Mid-Senior',
      skills: ['Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Python', 'Monitoring']
    },
    {
      id: '3',
      title: 'Product Manager',
      department: 'Product',
      seniority: 'Senior',
      skills: ['Product Strategy', 'Agile', 'UX/UI', 'Data Analysis', 'Leadership']
    },
    {
      id: '4',
      title: 'Marketing Manager',
      department: 'Marketing',
      seniority: 'Mid',
      skills: ['Digital Marketing', 'SEO/SEM', 'Social Media', 'Analytics', 'Content Strategy']
    }
  ];

  selectedJob: JobPosition | null = null;
  loading = signal(false);
  matches = signal<CandidateMatch[]>([]);

  private mockMatches: Record<string, CandidateMatch[]> = {
    '1': [
      {
        name: 'Carlos Rodríguez',
        matchScore: 94,
        email: 'carlos.rodriguez@email.com',
        phone: '+34 611 222 333',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
        experience: '7 años como Full Stack Developer, lideró equipo de 5 devs en startup fintech',
        strengths: [
          'Experto en React y arquitectura de microservicios',
          'Experiencia liderando equipos técnicos',
          'Certificaciones AWS Solutions Architect'
        ],
        concerns: [
          'Expectativa salarial en el extremo superior del rango',
          'Preferencia por trabajo 100% remoto'
        ],
        recommendation: 'Candidato excepcional con sólida experiencia técnica y liderazgo. Recomendar entrevista inmediata y preparar oferta competitiva.'
      },
      {
        name: 'Ana Martínez',
        matchScore: 91,
        email: 'ana.martinez@email.com',
        phone: '+34 622 333 444',
        skills: ['React', 'Vue', 'Node.js', 'MongoDB', 'TypeScript'],
        experience: '6 años como Full Stack, especializada en frontend con React/Vue',
        strengths: [
          'Excelentes habilidades de comunicación',
          'Experiencia en mentoría de juniors',
          'Portfolio impresionante de proyectos'
        ],
        concerns: [
          'Menos experiencia con AWS',
          'Buscando mejor balance vida-trabajo'
        ],
        recommendation: 'Excelente candidata con fuerte perfil técnico frontend. Su experiencia en mentoría sería valiosa para el equipo.'
      },
      {
        name: 'Miguel Torres',
        matchScore: 87,
        email: 'miguel.torres@email.com',
        phone: '+34 633 444 555',
        skills: ['Angular', 'Node.js', 'TypeScript', 'PostgreSQL', 'Redis'],
        experience: '5 años como Full Stack, trabajó en empresa enterprise con millones de usuarios',
        strengths: [
          'Experiencia en sistemas de alta escala',
          'Conocimiento profundo de bases de datos',
          'Buenas prácticas de testing'
        ],
        concerns: [
          'Experiencia limitada con React',
          'Cambio reciente de trabajo (hace 6 meses)'
        ],
        recommendation: 'Buen candidato con experiencia sólida en backend y sistemas escalables. Considerar para entrevista técnica.'
      }
    ],
    '2': [
      {
        name: 'Roberto Gómez',
        matchScore: 96,
        email: 'roberto.gomez@email.com',
        phone: '+34 644 555 666',
        skills: ['Kubernetes', 'AWS', 'Terraform', 'Docker', 'Python', 'Jenkins'],
        experience: '8 años en DevOps, implementó infraestructura cloud en 3 empresas',
        strengths: [
          'Experto en Kubernetes y orquestación',
          'Experiencia en migraciones cloud',
          'Automatización avanzada con Terraform'
        ],
        concerns: [
          'Expectativa de liderazgo a corto plazo',
          'Interés en proyectos solo con tecnología moderna'
        ],
        recommendation: 'Candidato top tier para el rol. Experiencia excepcional en todo el stack DevOps requerido. Acelerar proceso.'
      },
      {
        name: 'Laura Sánchez',
        matchScore: 89,
        email: 'laura.sanchez@email.com',
        phone: '+34 655 666 777',
        skills: ['AWS', 'Docker', 'Ansible', 'Python', 'Monitoring'],
        experience: '5 años en DevOps/SRE, especializada en observabilidad',
        strengths: [
          'Experta en monitoreo y alerting',
          'Experiencia en incident management',
          'Buenas habilidades de documentación'
        ],
        concerns: [
          'Menos experiencia con Kubernetes',
          'Perfil más SRE que DevOps puro'
        ],
        recommendation: 'Perfil fuerte con énfasis en observabilidad. Considerar si el rol requiere más enfoque en monitoring.'
      }
    ],
    '3': [
      {
        name: 'Patricia López',
        matchScore: 93,
        email: 'patricia.lopez@email.com',
        phone: '+34 666 777 888',
        skills: ['Product Strategy', 'Agile/Scrum', 'User Research', 'Data Analysis', 'Leadership'],
        experience: '10 años como PM, lanzó 15+ productos digitales exitosos',
        strengths: [
          'Track record comprobado de productos exitosos',
          'Excelente visión estratégica',
          'Fuerte liderazgo de equipos cross-funcionales'
        ],
        concerns: [
          'Requiere autonomía y recursos adecuados',
          'Expectativa salarial premium'
        ],
        recommendation: 'PM senior excepcional con historial probado. Ideal para liderar roadmap de producto. Considerar oferta agresiva.'
      }
    ],
    '4': [
      {
        name: 'Andrea Ruiz',
        matchScore: 90,
        email: 'andrea.ruiz@email.com',
        phone: '+34 677 888 999',
        skills: ['Digital Marketing', 'SEO/SEM', 'Social Media', 'Google Analytics', 'Content Marketing'],
        experience: '6 años en marketing digital, gestionó budgets de 500K+',
        strengths: [
          'ROI comprobado en campañas digitales',
          'Experiencia con SEO y SEM',
          'Data-driven en toma de decisiones'
        ],
        concerns: [
          'Menos experiencia en B2B',
          'Prefiere empresas en fase de crecimiento'
        ],
        recommendation: 'Marketing manager con sólida experiencia digital. Perfecto para escalar presencia online.'
      }
    ]
  };

  selectJob(job: JobPosition) {
    this.selectedJob = job;
    this.matches.set([]);
  }

  findMatches() {
    if (!this.selectedJob) return;

    this.loading.set(true);

    // Simulate AI matching process
    setTimeout(() => {
      const jobMatches = this.mockMatches[this.selectedJob!.id] || [];
      this.matches.set(jobMatches);
      this.loading.set(false);
    }, 2500);
  }

  getTopMatches(): CandidateMatch[] {
    return this.matches().filter(m => m.matchScore >= 85);
  }

  getRankBadgeClass(index: number): string {
    if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-600';
    if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-500';
    if (index === 2) return 'bg-gradient-to-br from-orange-400 to-orange-600';
    return 'bg-gradient-to-br from-green-400 to-green-600';
  }

  getScoreColor(score: number): string {
    if (score >= 90) return '#10b981'; // green-500
    if (score >= 80) return '#3b82f6'; // blue-500
    if (score >= 70) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  }
}

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  AnalysesListResponse,
  AnalysisDetailResponse,
  CandidateSearchParams,
  CandidateSearchResponse,
  StatisticsResponse,
  AnalysisSummary,
  CandidateDetail
} from '../models/analyses.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysesMockService {

  private mockCandidates: CandidateDetail[] = [
    {
      id: 1,
      analysis_id: 1,
      nombre: 'María González',
      email: 'maria.gonzalez@email.com',
      telefono: '+34 612 345 678',
      score: 92,
      categoria: 'entrevistar',
      fortalezaPrincipal: 'Excelente experiencia en desarrollo full-stack con React y Node.js',
      banderaRoja: 'Cambios frecuentes de trabajo en los últimos 2 años',
      fortalezas: [
        'Dominio avanzado de TypeScript y Angular',
        'Experiencia liderando equipos de 5+ desarrolladores',
        'Certificaciones en AWS y Azure'
      ],
      areasAtencion: [
        'Verificar motivos de cambios laborales frecuentes',
        'Evaluar expectativas salariales'
      ],
      consistencia: 'Alta consistencia entre CV y respuestas del formulario',
      preguntaSugerida: '¿Qué te motivó a cambiar de empresa tres veces en los últimos dos años?',
      analysis_date: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      analysis_id: 1,
      nombre: 'Carlos Ruiz',
      email: 'carlos.ruiz@email.com',
      telefono: '+34 623 456 789',
      score: 88,
      categoria: 'entrevistar',
      fortalezaPrincipal: 'Sólida experiencia en arquitectura de microservicios y DevOps',
      banderaRoja: 'Poca experiencia con tecnologías frontend',
      fortalezas: [
        'Experto en Kubernetes y Docker',
        'Implementación de CI/CD en proyectos enterprise',
        'Conocimiento profundo de Python y Go'
      ],
      areasAtencion: [
        'Validar capacidad de adaptación a stack frontend',
        'Confirmar disponibilidad para trabajar remoto'
      ],
      consistencia: 'Muy buena consistencia, detalles bien alineados',
      preguntaSugerida: '¿Cómo planeas desarrollar tus habilidades en tecnologías frontend?',
      analysis_date: '2024-01-15T10:00:00Z'
    },
    {
      id: 3,
      analysis_id: 1,
      nombre: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      telefono: '+34 634 567 890',
      score: 85,
      categoria: 'entrevistar',
      fortalezaPrincipal: 'Gran capacidad de comunicación y experiencia en mentoring',
      banderaRoja: 'Experiencia técnica limitada a un solo stack tecnológico',
      fortalezas: [
        'Habilidades de liderazgo demostradas',
        'Participación en comunidades tech',
        'Enfoque en buenas prácticas y clean code'
      ],
      areasAtencion: [
        'Evaluar capacidad de aprendizaje de nuevas tecnologías',
        'Verificar nivel técnico actual'
      ],
      consistencia: 'Buena consistencia general',
      preguntaSugerida: '¿Cómo te mantienes actualizada con nuevas tecnologías fuera de tu stack actual?',
      analysis_date: '2024-01-15T10:00:00Z'
    },
    {
      id: 4,
      analysis_id: 2,
      nombre: 'David López',
      email: 'david.lopez@email.com',
      telefono: '+34 645 678 901',
      score: 72,
      categoria: 'quizas',
      fortalezaPrincipal: 'Conocimiento en testing automatizado y QA',
      banderaRoja: 'Poca experiencia en desarrollo de features complejas',
      fortalezas: [
        'Experto en Jest, Cypress y Selenium',
        'Implementó suite completa de tests en proyecto anterior'
      ],
      areasAtencion: [
        'Perfil más orientado a QA que desarrollo',
        'Verificar interés real en desarrollo full-stack'
      ],
      consistencia: 'Consistencia moderada, algunas discrepancias menores',
      preguntaSugerida: '¿Prefieres enfocarte en desarrollo o en QA/testing?',
      analysis_date: '2024-01-10T10:00:00Z'
    },
    {
      id: 5,
      analysis_id: 2,
      nombre: 'Laura Fernández',
      email: 'laura.fernandez@email.com',
      telefono: '+34 656 789 012',
      score: 68,
      categoria: 'quizas',
      fortalezaPrincipal: 'Recién graduada con proyectos personales interesantes',
      banderaRoja: 'Sin experiencia profesional real',
      fortalezas: [
        'Portfolio de proyectos personales bien estructurado',
        'Conocimientos actualizados en tecnologías modernas'
      ],
      areasAtencion: [
        'Falta de experiencia en entorno profesional',
        'Necesitará mentoring intensivo inicial'
      ],
      consistencia: 'Buena consistencia para perfil junior',
      preguntaSugerida: '¿Cómo manejas el trabajo bajo presión y deadlines estrictos?',
      analysis_date: '2024-01-10T10:00:00Z'
    },
    {
      id: 6,
      analysis_id: 3,
      nombre: 'Pedro Jiménez',
      email: 'pedro.jimenez@email.com',
      telefono: '+34 689 012 345',
      score: 78,
      categoria: 'quizas',
      fortalezaPrincipal: 'Experiencia en desarrollo móvil con React Native',
      banderaRoja: 'Poca experiencia en backend',
      fortalezas: [
        'Apps publicadas en App Store y Play Store',
        'Conocimiento de UX/UI design'
      ],
      areasAtencion: [
        'Validar conocimientos de backend',
        'Evaluar capacidad de trabajo en equipo'
      ],
      consistencia: 'Buena consistencia',
      preguntaSugerida: '¿Cómo te sientes trabajando en el lado del servidor?',
      analysis_date: '2024-01-05T10:00:00Z'
    }
  ];

  private mockAnalyses: AnalysisSummary[] = [
    {
      id: 1,
      excel_file_name: 'candidatos_enero_2024.xlsx',
      analysis_date: '2024-01-15T10:00:00Z',
      total_candidates: 3,
      total_cvs_processed: 3,
      created_at: '2024-01-15T10:00:00Z',
      summary: {
        totalAnalizados: 3,
        paraEntrevistar: 3,
        quizas: 0,
        descartados: 0,
        top3: [
          { nombre: 'María González', score: 92, razon: 'Excelente experiencia full-stack' },
          { nombre: 'Carlos Ruiz', score: 88, razon: 'Sólida experiencia en DevOps' },
          { nombre: 'Ana Martínez', score: 85, razon: 'Gran capacidad de comunicación' }
        ]
      }
    },
    {
      id: 2,
      excel_file_name: 'candidatos_segunda_ronda.xlsx',
      analysis_date: '2024-01-10T10:00:00Z',
      total_candidates: 2,
      total_cvs_processed: 2,
      created_at: '2024-01-10T10:00:00Z',
      summary: {
        totalAnalizados: 2,
        paraEntrevistar: 0,
        quizas: 2,
        descartados: 0,
        top3: [
          { nombre: 'David López', score: 72, razon: 'Buen conocimiento en testing' },
          { nombre: 'Laura Fernández', score: 68, razon: 'Perfil junior prometedor' }
        ]
      }
    },
    {
      id: 3,
      excel_file_name: 'candidatos_especializados.xlsx',
      analysis_date: '2024-01-05T10:00:00Z',
      total_candidates: 1,
      total_cvs_processed: 1,
      created_at: '2024-01-05T10:00:00Z',
      summary: {
        totalAnalizados: 1,
        paraEntrevistar: 0,
        quizas: 1,
        descartados: 0,
        top3: [
          { nombre: 'Pedro Jiménez', score: 78, razon: 'Experiencia móvil' }
        ]
      }
    }
  ];

  constructor() {
    console.log('🎭 Mock Analyses Service initialized');
  }

  /**
   * Obtiene la lista de todos los análisis (paginada)
   */
  getAnalyses(page: number = 1, limit: number = 20): Observable<AnalysesListResponse> {
    console.log(`🎭 MOCK: getAnalyses(page: ${page}, limit: ${limit})`);

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedAnalyses = this.mockAnalyses.slice(start, end);

    return of({
      success: true,
      analyses: paginatedAnalyses,
      pagination: {
        page,
        limit,
        total: this.mockAnalyses.length,
        totalPages: Math.ceil(this.mockAnalyses.length / limit)
      }
    }).pipe(delay(800)); // Simular latencia de red
  }

  /**
   * Obtiene el detalle completo de un análisis con todos sus candidatos
   */
  getAnalysisDetail(id: number): Observable<AnalysisDetailResponse> {
    console.log(`🎭 MOCK: getAnalysisDetail(id: ${id})`);

    const analysis = this.mockAnalyses.find(a => a.id === id);
    const candidates = this.mockCandidates.filter(c => c.analysis_id === id);

    if (!analysis) {
      return of({
        success: false,
        analysis: null as any,
        error: 'Análisis no encontrado'
      }).pipe(delay(500));
    }

    return of({
      success: true,
      analysis: {
        ...analysis,
        candidates,
        excel_file_hash: 'mock-hash-' + id,
        metadata: {
          cvErrors: 0,
          promptSize: 5000,
          analysisDate: analysis.analysis_date
        },
        updated_at: analysis.analysis_date
      }
    }).pipe(delay(1000));
  }

  /**
   * Busca candidatos con filtros específicos
   */
  searchCandidates(searchParams: CandidateSearchParams): Observable<CandidateSearchResponse> {
    console.log('🎭 MOCK: searchCandidates', searchParams);

    let filtered = [...this.mockCandidates];

    // Filtrar por nombre
    if (searchParams.name) {
      const nameFilter = searchParams.name.toLowerCase();
      filtered = filtered.filter(c =>
        c.nombre.toLowerCase().includes(nameFilter)
      );
    }

    // Filtrar por email
    if (searchParams.email) {
      const emailFilter = searchParams.email.toLowerCase();
      filtered = filtered.filter(c =>
        c.email.toLowerCase().includes(emailFilter)
      );
    }

    // Filtrar por categoría
    if (searchParams.category) {
      filtered = filtered.filter(c => c.categoria === searchParams.category);
    }

    // Filtrar por score mínimo
    if (searchParams.minScore !== undefined) {
      filtered = filtered.filter(c => c.score >= searchParams.minScore!);
    }

    // Filtrar por score máximo
    if (searchParams.maxScore !== undefined) {
      filtered = filtered.filter(c => c.score <= searchParams.maxScore!);
    }

    // Filtrar por ID de análisis
    if (searchParams.analysisId) {
      filtered = filtered.filter(c => c.analysis_id === searchParams.analysisId);
    }

    // Limitar resultados
    const limit = searchParams.limit || 50;
    filtered = filtered.slice(0, limit);

    return of({
      success: true,
      candidates: filtered,
      count: filtered.length
    }).pipe(delay(600));
  }

  /**
   * Obtiene el top de candidatos de todos los análisis
   */
  getTopCandidates(limit: number = 10): Observable<CandidateSearchResponse> {
    console.log(`🎭 MOCK: getTopCandidates(limit: ${limit})`);

    const sorted = [...this.mockCandidates]
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return of({
      success: true,
      candidates: sorted,
      count: sorted.length
    }).pipe(delay(700));
  }

  /**
   * Obtiene estadísticas generales de todos los análisis
   */
  getStatistics(): Observable<StatisticsResponse> {
    console.log('🎭 MOCK: getStatistics');

    const totalCandidates = this.mockCandidates.length;
    const toInterview = this.mockCandidates.filter(c => c.categoria === 'entrevistar').length;
    const avgScore = this.mockCandidates.reduce((sum, c) => sum + c.score, 0) / totalCandidates;

    const scores = this.mockCandidates.map(c => c.score);
    const highestScore = Math.max(...scores);

    return of({
      success: true,
      statistics: {
        total_analyses: this.mockAnalyses.length,
        total_candidates_analyzed: totalCandidates,
        total_individual_records: totalCandidates,
        candidates_to_interview: toInterview,
        candidates_maybe: this.mockCandidates.filter(c => c.categoria === 'quizas').length,
        candidates_rejected: this.mockCandidates.filter(c => c.categoria === 'descartar').length,
        average_score: avgScore,
        highest_score: highestScore,
        first_analysis_date: '2024-01-05T10:00:00Z',
        last_analysis_date: '2024-01-15T10:00:00Z'
      }
    }).pipe(delay(500));
  }
}

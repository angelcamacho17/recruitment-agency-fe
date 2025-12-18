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

  private mockCandidates: CandidateDetail[] = this.generateMockCandidates();

  private generateMockCandidates(): CandidateDetail[] {
    const nombres = [
      'María González', 'Carlos Ruiz', 'Ana Martínez', 'David López', 'Laura Fernández',
      'Jorge Sánchez', 'Elena Torres', 'Pablo Rodríguez', 'Carmen Silva', 'Miguel Ángel Pérez',
      'Isabel Moreno', 'Francisco Jiménez', 'Lucía Romero', 'Javier Navarro', 'Patricia Muñoz',
      'Alejandro García', 'Cristina Álvarez', 'Raúl Delgado', 'Marta Vega', 'Antonio Castro',
      'Sara Ortiz', 'Daniel Rubio', 'Natalia Vargas', 'Roberto Medina', 'Andrea Soto',
      'Marcos Herrera', 'Beatriz Iglesias', 'Adrián Fuentes', 'Verónica Aguilar', 'Sergio Ramos',
      'Silvia Cortés', 'Iván Montero', 'Gloria Santana', 'Óscar Domínguez', 'Teresa Guerrero',
      'Fernando Márquez', 'Rocío Giménez', 'Víctor León', 'Pilar Méndez', 'Enrique Cruz',
      'Alicia Blanco', 'Manuel Herrero', 'Irene Gallardo', 'Alberto Cabrera', 'Rosa Castillo',
      'Luis Vázquez', 'Mónica Reyes', 'Guillermo Prieto', 'Eva Santos', 'Andrés Campos',
      'Julia Molina', 'Diego Nieto', 'Claudia Pascual', 'Rubén Suárez', 'Marina Lozano',
      'Pedro Carrasco', 'Sofía Cano', 'Ángel Esteban', 'Miriam Lorenzo', 'José Luis Calvo',
      'Carolina Benítez', 'Raquel Peña', 'Héctor Mora', 'Lidia Gil', 'Jesús Soler',
      'Esther Bravo', 'Ricardo Ramírez', 'Inmaculada Ferrer', 'César Flores', 'Diana Núñez',
      'Ignacio Parra', 'Nuria Sanz', 'Ángela Ibáñez', 'Eduardo Crespo', 'Elisa Caballero',
      'Alberto Mendoza', 'Celia Pastor'
    ];

    const fortalezas = [
      'Excelente experiencia en desarrollo full-stack con React y Node.js',
      'Sólida experiencia en arquitectura de microservicios y DevOps',
      'Gran capacidad de comunicación y experiencia en mentoring',
      'Conocimiento en testing automatizado y QA',
      'Recién graduado con proyectos personales interesantes',
      'Experto en bases de datos SQL y NoSQL',
      'Experiencia en metodologías ágiles y Scrum',
      'Fuerte background en seguridad informática',
      'Especialista en cloud computing (AWS, Azure, GCP)',
      'Dominio de Python y machine learning',
      'Experiencia liderando equipos distribuidos',
      'Conocimientos avanzados en UX/UI design',
      'Experto en optimización de rendimiento',
      'Sólida experiencia en API design y REST',
      'Conocimiento profundo de arquitectura hexagonal'
    ];

    const banderas = [
      'Cambios frecuentes de trabajo en los últimos 2 años',
      'Poca experiencia con tecnologías frontend',
      'Experiencia técnica limitada a un solo stack',
      'Poca experiencia en desarrollo de features complejas',
      'Sin experiencia profesional real',
      'Stack tecnológico muy desactualizado',
      'Perfil no alineado con los requisitos',
      'Expectativas salariales elevadas',
      'Disponibilidad limitada',
      'Nivel de inglés básico',
      'Poca experiencia en trabajo remoto',
      'Falta de certificaciones relevantes',
      'Gaps en historial laboral',
      'Ninguna destacable'
    ];

    const candidates: CandidateDetail[] = [];
    const count = 77;

    for (let i = 0; i < count; i++) {
      let categoria: 'entrevistar' | 'quizas' | 'descartar';
      let score: number;

      // Distribución: 35% entrevistar, 35% quizás, 30% descartar
      if (i < Math.floor(count * 0.35)) {
        categoria = 'entrevistar';
        score = 80 + Math.floor(Math.random() * 20); // 80-100
      } else if (i < Math.floor(count * 0.70)) {
        categoria = 'quizas';
        score = 60 + Math.floor(Math.random() * 20); // 60-80
      } else {
        categoria = 'descartar';
        score = 30 + Math.floor(Math.random() * 30); // 30-60
      }

      const nombre = nombres[i % nombres.length];
      const emailName = nombre.toLowerCase().replace(/\s+/g, '.').normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      candidates.push({
        id: i + 1,
        analysis_id: 1, // Todos en el mismo análisis
        nombre: nombre + (i >= nombres.length ? ` ${Math.floor(i / nombres.length) + 1}` : ''),
        email: `${emailName}${i >= nombres.length ? i : ''}@email.com`,
        telefono: `+34 6${String(10 + i).padStart(2, '0')} ${String(100 + i).padStart(3, '0')} ${String(100 + i).padStart(3, '0')}`,
        score: score,
        categoria: categoria,
        fortalezaPrincipal: fortalezas[i % fortalezas.length],
        banderaRoja: banderas[i % banderas.length],
        fortalezas: categoria === 'descartar' ? [] : [
          'Habilidades técnicas sólidas',
          'Buena comunicación'
        ],
        areasAtencion: categoria === 'entrevistar' ? [
          'Verificar referencias',
          'Evaluar fit cultural'
        ] : [
          'Requiere evaluación adicional',
          'Verificar expectativas'
        ],
        consistencia: categoria === 'entrevistar' ? 'Alta consistencia' : categoria === 'quizas' ? 'Consistencia moderada' : 'Baja consistencia',
        preguntaSugerida: categoria === 'descartar' ? undefined : '¿Cuáles son tus principales motivaciones para este cambio?',
        analysis_date: '2024-01-15T10:00:00Z'
      });
    }

    // Ordenar por score descendente
    candidates.sort((a, b) => b.score - a.score);

    return candidates;
  }

  private mockAnalyses: AnalysisSummary[] = this.generateMockAnalyses();

  private generateMockAnalyses(): AnalysisSummary[] {
    const totalCandidates = this.mockCandidates.length;
    const paraEntrevistar = this.mockCandidates.filter(c => c.categoria === 'entrevistar').length;
    const quizas = this.mockCandidates.filter(c => c.categoria === 'quizas').length;
    const descartados = this.mockCandidates.filter(c => c.categoria === 'descartar').length;

    const top3 = this.mockCandidates.slice(0, 3).map(c => ({
      nombre: c.nombre,
      score: c.score,
      razon: c.fortalezaPrincipal
    }));

    return [
      {
        id: 1,
        excel_file_name: 'candidatos_enero_2024.xlsx',
        analysis_date: '2024-01-15T10:00:00Z',
        total_candidates: totalCandidates,
        total_cvs_processed: totalCandidates,
        created_at: '2024-01-15T10:00:00Z',
        summary: {
          totalAnalizados: totalCandidates,
          paraEntrevistar: paraEntrevistar,
          quizas: quizas,
          descartados: descartados,
          top3: top3
        }
      }
    ];
  }

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

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AnalysisResult, ProgressEvent, FinalResult, CandidateScore } from '../models/cv-analysis.model';

@Injectable({
  providedIn: 'root'
})
export class CvAnalysisMockService {

  /**
   * Simula el análisis de CVs con progreso en tiempo real
   */
  analyzeCVWithProgress(excelFile: File, cvFiles: File[]): Observable<ProgressEvent | FinalResult> {
    const subject = new Subject<ProgressEvent | FinalResult>();

    console.log('🎭 Usando MOCK - Simulando análisis de CVs...');
    console.log(`📊 Excel: ${excelFile.name}`);
    console.log(`📄 CVs: ${cvFiles.length} archivos`);

    // Simular progreso paso a paso
    setTimeout(() => {
      subject.next({
        step: 'start',
        message: 'Iniciando análisis...',
        timestamp: new Date().toISOString()
      } as ProgressEvent);
    }, 500);

    setTimeout(() => {
      subject.next({
        step: 'upload',
        message: 'Archivos cargados correctamente',
        info: `Excel: ${excelFile.name}, CVs: ${cvFiles.length}`,
        timestamp: new Date().toISOString()
      } as ProgressEvent);
    }, 1000);

    setTimeout(() => {
      subject.next({
        step: 'excel',
        message: 'Procesando archivo Excel...',
        info: 'Extrayendo datos de candidatos',
        timestamp: new Date().toISOString()
      } as ProgressEvent);
    }, 2000);

    setTimeout(() => {
      subject.next({
        step: 'pdfs',
        message: 'Analizando CVs en PDF...',
        info: `Procesando ${cvFiles.length} documentos`,
        timestamp: new Date().toISOString(),
        progress: 50
      } as ProgressEvent);
    }, 3500);

    setTimeout(() => {
      subject.next({
        step: 'prompt',
        message: 'Preparando análisis con IA...',
        info: 'Generando prompt para Claude',
        timestamp: new Date().toISOString(),
        progress: 60
      } as ProgressEvent);
    }, 5000);

    setTimeout(() => {
      subject.next({
        step: 'claude',
        message: 'Analizando candidatos con IA...',
        info: 'Claude está procesando la información',
        timestamp: new Date().toISOString(),
        progress: 90
      } as ProgressEvent);
    }, 6500);

    setTimeout(() => {
      subject.next({
        step: 'cleanup',
        message: 'Finalizando análisis...',
        timestamp: new Date().toISOString(),
        progress: 95
      } as ProgressEvent);
    }, 8000);

    // Enviar resultado final después de 9 segundos
    setTimeout(() => {
      const mockAnalysis = this.generateMockAnalysis();

      subject.next({
        step: 'complete',
        message: '¡Análisis completado!',
        timestamp: new Date().toISOString(),
        progress: 100
      } as ProgressEvent);

      subject.next({
        done: true,
        success: true,
        analysis: mockAnalysis
      } as FinalResult);

      subject.complete();
    }, 9000);

    return subject.asObservable();
  }

  /**
   * Genera datos mock de análisis de candidatos
   */
  private generateMockAnalysis(): AnalysisResult {
    // Generar 77 candidatos distribuidos en las categorías
    const candidates: CandidateScore[] = this.generateCandidates(77);

    return {
      resumen: {
        totalAnalizados: candidates.length,
        paraEntrevistar: candidates.filter(c => c.categoria === 'entrevistar').length,
        quizas: candidates.filter(c => c.categoria === 'quizas').length,
        descartados: candidates.filter(c => c.categoria === 'descartar').length,
        top3: [
          {
            nombre: candidates[0].nombre,
            score: candidates[0].score,
            razon: candidates[0].fortalezaPrincipal
          },
          {
            nombre: candidates[1].nombre,
            score: candidates[1].score,
            razon: candidates[1].fortalezaPrincipal
          },
          {
            nombre: candidates[2].nombre,
            score: candidates[2].score,
            razon: candidates[2].fortalezaPrincipal
          }
        ]
      },
      candidatos: candidates,
      rawResponse: JSON.stringify({ mock: true, timestamp: new Date() })
    };
  }

  /**
   * Genera un array de candidatos mock
   */
  private generateCandidates(count: number): CandidateScore[] {
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

    const candidates: CandidateScore[] = [];

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
          preguntaSugerida: categoria === 'descartar' ? undefined : '¿Cuáles son tus principales motivaciones para este cambio?'
        });
    }

    // Ordenar por score descendente
    candidates.sort((a, b) => b.score - a.score);

    return candidates;
  }

  /**
   * Verifica el estado del servicio (mock)
   */
  checkHealth(): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          status: 'ok',
          message: 'Mock service is running',
          mode: 'mock'
        });
        observer.complete();
      }, 300);
    });
  }
}

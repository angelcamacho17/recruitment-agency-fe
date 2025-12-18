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
    const candidates: CandidateScore[] = [
      {
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
        preguntaSugerida: '¿Qué te motivó a cambiar de empresa tres veces en los últimos dos años?'
      },
      {
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
        preguntaSugerida: '¿Cómo planeas desarrollar tus habilidades en tecnologías frontend?'
      },
      {
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
        preguntaSugerida: '¿Cómo te mantienes actualizada con nuevas tecnologías fuera de tu stack actual?'
      },
      {
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
        preguntaSugerida: '¿Prefieres enfocarte en desarrollo o en QA/testing?'
      },
      {
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
        preguntaSugerida: '¿Cómo manejas el trabajo bajo presión y deadlines estrictos?'
      },
      {
        nombre: 'Jorge Sánchez',
        email: 'jorge.sanchez@email.com',
        telefono: '+34 667 890 123',
        score: 55,
        categoria: 'descartar',
        fortalezaPrincipal: 'Experiencia general en IT',
        banderaRoja: 'Stack tecnológico muy desactualizado',
        fortalezas: [
          'Años de experiencia en la industria'
        ],
        areasAtencion: [
          'Tecnologías obsoletas (jQuery, PHP 5)',
          'No muestra interés en aprender nuevas tecnologías',
          'Expectativas salariales muy altas para el perfil'
        ],
        consistencia: 'Inconsistencias entre CV y formulario'
      },
      {
        nombre: 'Elena Torres',
        email: 'elena.torres@email.com',
        telefono: '+34 678 901 234',
        score: 45,
        categoria: 'descartar',
        fortalezaPrincipal: 'Ninguna destacable para la posición',
        banderaRoja: 'Perfil no alineado con los requisitos',
        fortalezas: [],
        areasAtencion: [
          'Experiencia principalmente en soporte técnico',
          'Nivel de inglés insuficiente',
          'No cumple con requisitos mínimos técnicos'
        ],
        consistencia: 'Baja consistencia, varios datos no coinciden'
      }
    ];

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

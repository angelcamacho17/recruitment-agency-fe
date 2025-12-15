import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AnalysisResult, ProgressEvent, FinalResult } from '../models/cv-analysis.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CvAnalysisService {
  private apiUrl = `${environment.apiUrl}/cv-analysis`;

  constructor(private http: HttpClient) {}

  /**
   * Analiza CVs con progreso en tiempo real usando SSE
   * @param excelFile Archivo Excel con datos del formulario
   * @param cvFiles Array de archivos PDF con los CVs
   * @returns Observable con eventos de progreso y resultado final
   */
  analyzeCVWithProgress(excelFile: File, cvFiles: File[]): Observable<ProgressEvent | FinalResult> {
    const subject = new Subject<ProgressEvent | FinalResult>();

    // Crear FormData
    const formData = new FormData();
    formData.append('excel', excelFile, excelFile.name);
    cvFiles.forEach(cv => formData.append('cvs', cv, cv.name));

    console.log('📤 Iniciando análisis con SSE...');
    console.log(`📊 Excel: ${excelFile.name}`);
    console.log(`📄 CVs: ${cvFiles.length} archivos`);

    // Usar fetch para SSE
    fetch(`${this.apiUrl}/analyze-stream`, {
      method: 'POST',
      body: formData
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Leer el stream
      const readStream = (): void => {
        reader.read().then(({ done, value }) => {
          if (done) {
            subject.complete();
            return;
          }

          // Decodificar chunk
          buffer += decoder.decode(value, { stream: true });

          // Procesar líneas completas
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Guardar última línea incompleta

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                subject.next(data);

                // Si es el evento final, completar
                if ('done' in data && data.done) {
                  subject.complete();
                  return;
                }
              } catch (error) {
                console.error('Error parsing SSE data:', error);
              }
            }
          }

          // Continuar leyendo
          readStream();
        }).catch(error => {
          subject.error(error);
        });
      };

      readStream();
    }).catch(error => {
      subject.error(error);
    });

    return subject.asObservable();
  }

  /**
   * Analiza CVs enviando archivos al backend (método sin progreso - para compatibilidad)
   * @param excelFile Archivo Excel con datos del formulario
   * @param cvFiles Array de archivos PDF con los CVs
   * @returns Observable con el resultado del análisis
   */
  analyzeCV(excelFile: File, cvFiles: File[]): Observable<AnalysisResult> {
    const formData = new FormData();

    // Agregar archivo Excel (requerido)
    formData.append('excel', excelFile, excelFile.name);

    // Agregar archivos PDF (opcional)
    cvFiles.forEach((file) => {
      formData.append('cvs', file, file.name);
    });

    console.log('📤 Enviando análisis al backend...');
    console.log(`📊 Excel: ${excelFile.name}`);
    console.log(`📄 CVs: ${cvFiles.length} archivos`);

    return this.http.post<any>(`${this.apiUrl}/analyze`, formData).pipe(
      map(response => {
        // Adaptar respuesta del backend al formato del frontend
        if (response.success && response.analysis) {
          return {
            resumen: response.analysis.resumen,
            candidatos: response.analysis.candidatos,
            rawResponse: JSON.stringify(response)
          } as AnalysisResult;
        }
        throw new Error('Respuesta inválida del servidor');
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Verifica el estado del servicio
   */
  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      switch (error.status) {
        case 400:
          errorMessage = error.error?.error || 'Archivos inválidos. Verifica el formato.';
          break;
        case 429:
          errorMessage = 'Has excedido el límite de análisis. Intenta más tarde.';
          break;
        case 500:
          errorMessage = error.error?.error || 'Error en el servidor al procesar los archivos.';
          break;
        case 503:
          errorMessage = 'El servicio no está disponible. Contacta al administrador.';
          break;
        default:
          errorMessage = error.error?.error || `Error ${error.status}: ${error.statusText}`;
      }
    }

    console.error('❌ Error en análisis:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

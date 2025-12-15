export interface Candidate {
  nombre: string;
  email: string;
  telefono: string;
  razonInteres: string[];
  habilidades: string[];
  descripcionAmigos: string[];
  porQueContratarme: string;
  cvFile?: File;
}

export interface CandidateScore {
  nombre: string;
  email: string;
  telefono: string;
  score: number;
  categoria: 'entrevistar' | 'quizas' | 'descartar';
  fortalezaPrincipal: string;
  banderaRoja: string;
  fortalezas?: string[];
  areasAtencion?: string[];
  consistencia?: string;
  preguntaSugerida?: string;
}

export interface AnalysisResult {
  resumen: {
    totalAnalizados: number;
    paraEntrevistar: number;
    quizas: number;
    descartados: number;
    top3: {
      nombre: string;
      score: number;
      razon: string;
    }[];
  };
  candidatos: CandidateScore[];
  rawResponse?: string;
}

// SSE Progress Events
export interface ProgressEvent {
  step: 'start' | 'upload' | 'excel' | 'pdfs' | 'prompt' | 'claude' | 'cleanup' | 'complete' | 'error' | 'warning';
  message: string;
  timestamp: string;

  // Datos opcionales según el step
  candidatesCount?: number;
  total?: number;
  current?: number;
  progress?: number;
  error?: boolean;
  warning?: boolean;
  info?: string;
  successful?: number;
  failed?: number;
  promptSize?: number;
  promptSizeKB?: number;
}

export interface FinalResult {
  done: true;
  success: boolean;
  analysis?: AnalysisResult;
  metadata?: {
    totalCandidatos: number;
    totalCVsProcesados: number;
    totalCVsConError: number;
    timestamp: string;
  };
  error?: string;
  details?: string;
}

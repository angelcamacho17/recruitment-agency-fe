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

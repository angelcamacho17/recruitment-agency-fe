// Modelo para un análisis en la lista
export interface AnalysisSummary {
  id: number;
  analysis_date: string;
  total_candidates: number;
  total_cvs_processed: number;
  excel_file_name: string;
  summary: {
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
  created_at: string;
}

// Respuesta de la lista de análisis
export interface AnalysesListResponse {
  success: boolean;
  analyses: AnalysisSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Candidato detallado
export interface CandidateDetail {
  id?: number;
  analysis_id?: number;
  nombre: string;
  name?: string; // alias
  email: string;
  telefono?: string;
  phone?: string; // alias
  score: number;
  categoria: 'entrevistar' | 'quizas' | 'descartar';
  category?: string; // alias
  fortalezaPrincipal: string;
  main_strength?: string; // alias
  banderaRoja: string;
  red_flag?: string; // alias
  fortalezas?: string[];
  strengths?: string[]; // alias
  areasAtencion?: string[];
  areas_attention?: string[]; // alias
  consistencia?: string;
  consistency?: string; // alias
  preguntaSugerida?: string;
  suggested_question?: string; // alias
  full_data?: any;
  created_at?: string;
  analysis_date?: string;
  excel_file_name?: string;
}

// Análisis completo con todos los candidatos
export interface AnalysisDetail {
  id: number;
  analysis_date: string;
  total_candidates: number;
  total_cvs_processed: number;
  excel_file_name: string;
  excel_file_hash: string;
  summary: {
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
  candidates: CandidateDetail[];
  metadata: {
    cvErrors: number;
    promptSize: number;
    analysisDate: string;
  };
  created_at: string;
  updated_at: string;
}

// Respuesta del detalle de un análisis
export interface AnalysisDetailResponse {
  success: boolean;
  analysis: AnalysisDetail;
}

// Parámetros de búsqueda de candidatos
export interface CandidateSearchParams {
  name?: string;
  email?: string;
  minScore?: number;
  maxScore?: number;
  category?: 'entrevistar' | 'quizas' | 'descartar';
  analysisId?: number;
  limit?: number;
}

// Respuesta de búsqueda de candidatos
export interface CandidateSearchResponse {
  success: boolean;
  count: number;
  candidates: CandidateDetail[];
}

// Estadísticas generales
export interface Statistics {
  total_analyses: number;
  total_candidates_analyzed: number;
  total_individual_records: number;
  candidates_to_interview: number;
  candidates_maybe: number;
  candidates_rejected: number;
  average_score: number;
  highest_score: number;
  first_analysis_date: string;
  last_analysis_date: string;
}

// Respuesta de estadísticas
export interface StatisticsResponse {
  success: boolean;
  statistics: Statistics;
}

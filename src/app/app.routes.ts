import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/cv-analysis',
    pathMatch: 'full'
  },
  {
    path: 'cv-analysis',
    loadComponent: () => import('./features/cv-analysis/cv-analysis.component').then(m => m.CvAnalysisComponent)
  },
  {
    path: 'candidates',
    loadComponent: () => import('./features/candidates/candidates-dashboard.component').then(m => m.CandidatesDashboardComponent)
  },
  {
    path: 'candidates/analysis/:id',
    loadComponent: () => import('./features/candidates/analysis-detail.component').then(m => m.AnalysisDetailComponent)
  },
  {
    path: '**',
    redirectTo: '/cv-analysis'
  }
];

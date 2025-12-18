import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'cv-analysis',
    loadComponent: () => import('./features/cv-analysis/cv-analysis.component').then(m => m.CvAnalysisComponent)
  },
  {
    path: 'content-generator',
    loadComponent: () => import('./features/content-generator/content-generator.component').then(m => m.ContentGeneratorComponent)
  },
  {
    path: 'talent-matching',
    loadComponent: () => import('./features/talent-matching/talent-matching.component').then(m => m.TalentMatchingComponent)
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
    redirectTo: '/'
  }
];

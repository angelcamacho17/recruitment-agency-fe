import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'contacts',
    loadComponent: () => import('./features/contacts/contacts-list.component').then(m => m.ContactsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'contacts/:id',
    loadComponent: () => import('./features/contacts/contact-detail.component').then(m => m.ContactDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'emails',
    loadComponent: () => import('./features/emails/emails-list.component').then(m => m.EmailsListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cv-analysis',
    loadComponent: () => import('./features/cv-analysis/cv-analysis.component').then(m => m.CvAnalysisComponent),
    canActivate: [authGuard]
  },
  {
    path: 'candidates',
    loadComponent: () => import('./features/candidates/candidates-dashboard.component').then(m => m.CandidatesDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'candidates/analysis/:id',
    loadComponent: () => import('./features/candidates/analysis-detail.component').then(m => m.AnalysisDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'contacts',
    loadComponent: () => import('./features/contacts/contacts-list.component').then(m => m.ContactsListComponent)
  },
  {
    path: 'contacts/:id',
    loadComponent: () => import('./features/contacts/contact-detail.component').then(m => m.ContactDetailComponent)
  },
  {
    path: 'emails',
    loadComponent: () => import('./features/emails/emails-list.component').then(m => m.EmailsListComponent)
  },
  {
    path: 'cv-analysis',
    loadComponent: () => import('./features/cv-analysis/cv-analysis.component').then(m => m.CvAnalysisComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

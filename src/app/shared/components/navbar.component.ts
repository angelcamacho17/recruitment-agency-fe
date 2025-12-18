import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

interface AgentInfo {
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg flex-shrink-0 border-b-4" [class]="currentAgent()?.gradient || 'border-primary-500'">
      <div class="max-w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center ml-12 md:ml-0 gap-4">
            <!-- Agent Icon & Name -->
            <div *ngIf="currentAgent()" class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center" [class]="currentAgent()!.color">
                <span class="text-2xl">{{ currentAgent()!.icon }}</span>
              </div>
              <div>
                <h1 class="text-xl md:text-2xl font-bold text-gray-900">{{ currentAgent()!.name }}</h1>
                <p class="text-xs text-gray-500">Agente IA</p>
              </div>
            </div>
            <!-- Default Home -->
            <div *ngIf="!currentAgent()" class="flex items-center gap-3">
              <div>
                <h1 class="text-xl md:text-2xl font-bold text-gray-900">Centro de Agentes IA</h1>
                <p class="text-xs text-gray-500">Plataforma de Reclutamiento y Marketing</p>
              </div>
            </div>
          </div>

          <!-- Breadcrumb / Location -->
          <div class="hidden md:flex items-center gap-2 text-sm text-gray-600">
            <a routerLink="/" class="hover:text-primary-600 transition-colors">Inicio</a>
            <span *ngIf="currentAgent()">/</span>
            <span *ngIf="currentAgent()" class="font-semibold" [style.color]="getBreadcrumbColor()">{{ currentAgent()!.name }}</span>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private router = inject(Router);

  private agentMap: Record<string, AgentInfo> = {
    '/cv-analysis': {
      name: 'CV Scout',
      icon: '🎯',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      gradient: 'border-blue-500'
    },
    '/content-generator': {
      name: 'Content Genius',
      icon: '✨',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      gradient: 'border-purple-500'
    },
    '/talent-matching': {
      name: 'Talent Matcher',
      icon: '🤝',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      gradient: 'border-green-500'
    },
    '/candidates': {
      name: 'Gestión de Candidatos',
      icon: '📋',
      color: 'bg-gradient-to-br from-primary-500 to-primary-600',
      gradient: 'border-primary-500'
    }
  };

  currentAgent = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const url = this.router.url.split('?')[0];
        // Check if URL starts with any agent path
        for (const path in this.agentMap) {
          if (url.startsWith(path)) {
            return this.agentMap[path];
          }
        }
        return null;
      })
    ),
    { initialValue: this.getInitialAgent() }
  );

  private getInitialAgent(): AgentInfo | null {
    const url = this.router.url.split('?')[0];
    for (const path in this.agentMap) {
      if (url.startsWith(path)) {
        return this.agentMap[path];
      }
    }
    return null;
  }

  getBreadcrumbColor(): string {
    const agent = this.currentAgent();
    if (!agent) return '#eeb30a';

    const colorMap: Record<string, string> = {
      'CV Scout': '#3b82f6',
      'Content Genius': '#a855f7',
      'Talent Matcher': '#10b981',
      'Gestión de Candidatos': '#eeb30a'
    };

    return colorMap[agent.name] || '#eeb30a';
  }
}

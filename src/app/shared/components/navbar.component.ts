import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="bg-white shadow-lg flex-shrink-0">
      <div class="max-w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center ml-12 md:ml-0">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-primary-600">Recruitment Agency</h1>
            </div>
          </div>
          <div class="hidden sm:flex items-center">
            <span class="text-gray-700 text-xs sm:text-sm">Dashboard de Administración</span>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}

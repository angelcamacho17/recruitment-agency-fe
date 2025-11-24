import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-tags',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
      <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tags Más Usados</h3>
      <div class="space-y-2 sm:space-y-3">
        <div *ngFor="let tag of topTags" class="flex items-center justify-between">
          <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <span class="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-primary-100 text-primary-800 truncate max-w-full">
              {{ tag.tag }}
            </span>
          </div>
          <span class="text-gray-600 font-semibold text-sm sm:text-base flex-shrink-0 ml-2">{{ tag.count }}</span>
        </div>
        <div *ngIf="!topTags || topTags.length === 0" class="text-center py-4 text-gray-500 text-sm">
          No hay tags disponibles
        </div>
      </div>
    </div>
  `
})
export class TopTagsComponent {
  @Input() topTags: any[] = [];
}

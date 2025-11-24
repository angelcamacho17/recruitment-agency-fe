import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { SidebarComponent } from './shared/components/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <div class="flex flex-col bg-gray-50" style="height: 100vh;">
      <app-navbar></app-navbar>
      <div class="flex flex-1 overflow-hidden" style="height: 100%;">
        <app-sidebar></app-sidebar>
        <main class="flex-1 overflow-y-auto" style="height: 100%;">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'whatsapp-dashboard';
}

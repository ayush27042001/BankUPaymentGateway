import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';
import { CommonSearchFilterComponent } from '../../shared/search-filter/search-filter';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    Sidebar,
    Navbar,
    CommonSearchFilterComponent
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {
  isMobileSidebarOpen = signal(false);

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen.update(state => !state);
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
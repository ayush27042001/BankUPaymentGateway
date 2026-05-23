import { Component, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html', 
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() isMobileSidebarOpen = signal(false);

  mastersExpanded = true;
  merchantExpanded = false;
  reportExpanded = false;
  settingsExpanded = false;
  userExpanded = false;
  onboardingExpanded = false;

  toggleMasters(): void {
    this.mastersExpanded = !this.mastersExpanded;
  }

  toggleMerchant(): void {
    this.merchantExpanded = !this.merchantExpanded;
  }
  toggleOnboarding(): void {
  this.onboardingExpanded = !this.onboardingExpanded;
}
  toggleUsers(): void {
  this.userExpanded = !this.userExpanded;
}

  toggleReport(): void {
    this.reportExpanded = !this.reportExpanded;
  }

  toggleSettings(): void {
    this.settingsExpanded = !this.settingsExpanded;
  }
/* =========================================
   SUPPORT
========================================= */

openSupport(): void {

  alert(
    'Support section coming soon.'
  );

}

/* =========================================
   LOGOUT
========================================= */

logout(): void {

  localStorage.clear();

  sessionStorage.clear();

  window.location.href = '/login';

}
}
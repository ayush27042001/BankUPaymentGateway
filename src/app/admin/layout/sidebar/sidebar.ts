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

  /* =========================================
     MENU STATES
  ========================================= */

  mastersExpanded = true;

  merchantExpanded = false;

  reportExpanded = false;

  settingsExpanded = false;

  userExpanded = false;

  onboardingExpanded = false;

  /* =========================================
     CLOSE ALL MENUS
  ========================================= */

  closeAllMenus(): void {

    this.mastersExpanded = false;

    this.merchantExpanded = false;

    this.reportExpanded = false;

    this.settingsExpanded = false;

    this.userExpanded = false;

    this.onboardingExpanded = false;

  }

  /* =========================================
     TOGGLE MASTERS
  ========================================= */

  toggleMasters(): void {

    const isOpen = this.mastersExpanded;

    this.closeAllMenus();

    this.mastersExpanded = !isOpen;

  }

  /* =========================================
     TOGGLE MERCHANT
  ========================================= */

  toggleMerchant(): void {

    const isOpen = this.merchantExpanded;

    this.closeAllMenus();

    this.merchantExpanded = !isOpen;

  }

  /* =========================================
     TOGGLE ONBOARDING
  ========================================= */

  toggleOnboarding(): void {

    const isOpen = this.onboardingExpanded;

    this.closeAllMenus();

    this.onboardingExpanded = !isOpen;

  }

  /* =========================================
     TOGGLE USERS
  ========================================= */

  toggleUsers(): void {

    const isOpen = this.userExpanded;

    this.closeAllMenus();

    this.userExpanded = !isOpen;

  }

  /* =========================================
     TOGGLE REPORT
  ========================================= */

  toggleReport(): void {

    const isOpen = this.reportExpanded;

    this.closeAllMenus();

    this.reportExpanded = !isOpen;

  }

  /* =========================================
     TOGGLE SETTINGS
  ========================================= */

  toggleSettings(): void {

    const isOpen = this.settingsExpanded;

    this.closeAllMenus();

    this.settingsExpanded = !isOpen;

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
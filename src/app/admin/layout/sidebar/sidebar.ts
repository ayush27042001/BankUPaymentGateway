import { Component, Input, signal, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SuperAdminAuthService } from '../../services/superadmin-auth.service';

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

  constructor(
    private router: Router,
    private superAdminAuthService: SuperAdminAuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /* =========================================
     MENU STATES
  ========================================= */

  mastersExpanded = signal(false);

  merchantExpanded = signal(false);

  reportExpanded = signal(false);

  settingsExpanded = signal(false);

  userExpanded = signal(false);

  onboardingExpanded = signal(false);

  /* =========================================
     CLOSE ALL MENUS
  ========================================= */

  closeAllMenus(): void {

    this.mastersExpanded.set(false);

    this.merchantExpanded.set(false);

    this.reportExpanded.set(false);

    this.settingsExpanded.set(false);

    this.userExpanded.set(false);

    this.onboardingExpanded.set(false);

  }

  /* =========================================
     TOGGLE MASTERS
  ========================================= */

  toggleMasters(): void {

    const isOpen = this.mastersExpanded();

    this.closeAllMenus();

    this.mastersExpanded.set(!isOpen);

    this.cdr.detectChanges();

  }

  /* =========================================
     TOGGLE MERCHANT
  ========================================= */

  toggleMerchant(): void {

    const isOpen = this.merchantExpanded();

    this.closeAllMenus();

    this.merchantExpanded.set(!isOpen);

    this.cdr.detectChanges();

  }

  /* =========================================
     TOGGLE ONBOARDING
  ========================================= */

  toggleOnboarding(): void {

    const isOpen = this.onboardingExpanded();

    this.closeAllMenus();

    this.onboardingExpanded.set(!isOpen);

    this.cdr.detectChanges();

  }

  /* =========================================
     TOGGLE USERS
  ========================================= */

  toggleUsers(): void {

    const isOpen = this.userExpanded();

    this.closeAllMenus();

    this.userExpanded.set(!isOpen);

    this.cdr.detectChanges();

  }

  /* =========================================
     TOGGLE REPORT
  ========================================= */

  toggleReport(): void {

    const isOpen = this.reportExpanded();

    this.closeAllMenus();

    this.reportExpanded.set(!isOpen);

    this.cdr.detectChanges();

  }

  /* =========================================
     TOGGLE SETTINGS
  ========================================= */

  toggleSettings(): void {

    const isOpen = this.settingsExpanded();

    this.closeAllMenus();

    this.settingsExpanded.set(!isOpen);

    this.cdr.detectChanges();

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

    this.superAdminAuthService.logoutAdmin();

  }

}
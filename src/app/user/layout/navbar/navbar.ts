import {
  Component,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  @Output()
  modeChanged = new EventEmitter<'live' | 'test'>();

  @Output()
  toggleMobileMenu = new EventEmitter<void>();

  // =========================
  // MODE DROPDOWN
  // =========================

  isModeDropdownOpen = false;

  selectedMode = 'Live Mode';

  // =========================
  // PROFILE DROPDOWN
  // =========================

  isProfileDropdownOpen = false;

  // =========================
  // PRODUCT DROPDOWN
  // =========================

  productDropdownOpen = false;

  selectedProduct = 'Payments';

  // =========================
  // NOTIFICATIONS
  // =========================

  notifications = 3;

  // =========================
  // MOBILE MENU
  // =========================

  onMenuToggle(): void {
    this.toggleMobileMenu.emit();
  }

  // =========================
  // PRODUCT SWITCHER
  // =========================

  toggleProductDropdown(event: Event): void {
    event.stopPropagation();

    this.productDropdownOpen =
      !this.productDropdownOpen;

    this.isModeDropdownOpen = false;
    this.isProfileDropdownOpen = false;
  }

  selectProduct(product: string): void {
    this.selectedProduct = product;

    this.productDropdownOpen = false;
  }

  // =========================
  // MODE DROPDOWN
  // =========================

  toggleModeDropdown(event: Event): void {
    event.stopPropagation();

    this.isModeDropdownOpen =
      !this.isModeDropdownOpen;

    this.isProfileDropdownOpen = false;
    this.productDropdownOpen = false;
  }

  selectMode(mode: string): void {
    this.selectedMode = mode;

    this.isModeDropdownOpen = false;

    this.modeChanged.emit(
      mode === 'Live Mode'
        ? 'live'
        : 'test'
    );
  }

  // =========================
  // PROFILE DROPDOWN
  // =========================

  toggleProfileDropdown(event: Event): void {
    event.stopPropagation();

    this.isProfileDropdownOpen =
      !this.isProfileDropdownOpen;

    this.isModeDropdownOpen = false;
    this.productDropdownOpen = false;
  }

  // =========================
  // CLOSE ALL DROPDOWNS
  // =========================

  @HostListener('document:click')
  closeAllDropdowns(): void {

    this.isModeDropdownOpen = false;

    this.isProfileDropdownOpen = false;

    this.productDropdownOpen = false;
  }

}
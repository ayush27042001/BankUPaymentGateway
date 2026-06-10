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

  /* =========================================
     MODE CHANGE EVENT
  ========================================= */

  @Output()
  modeChanged =
    new EventEmitter<'live' | 'test'>();

  /* =========================================
     MODE DROPDOWN
  ========================================= */

  isModeDropdownOpen = false;

  selectedMode = 'Live Mode';

  toggleModeDropdown(
    event: Event
  ): void {

    event.stopPropagation();

    this.isModeDropdownOpen =
      !this.isModeDropdownOpen;

    this.isProfileDropdownOpen = false;

  }

  selectMode(
    mode: string
  ): void {

    this.selectedMode = mode;

    this.isModeDropdownOpen = false;

    this.modeChanged.emit(
      mode === 'Live Mode'
        ? 'live'
        : 'test'
    );

  }

  /* =========================================
     PROFILE DROPDOWN
  ========================================= */

  isProfileDropdownOpen = false;

  toggleProfileDropdown(
    event: Event
  ): void {

    event.stopPropagation();

    this.isProfileDropdownOpen =
      !this.isProfileDropdownOpen;

    this.isModeDropdownOpen = false;

  }

  /* =========================================
     CLOSE DROPDOWNS
  ========================================= */

  @HostListener('document:click')
  closeAllDropdowns(): void {

    this.isModeDropdownOpen = false;

    this.isProfileDropdownOpen = false;

  }

}
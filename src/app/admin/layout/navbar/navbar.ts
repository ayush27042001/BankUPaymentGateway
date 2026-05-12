import { Component, Output, EventEmitter } from '@angular/core';
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
  @Output() toggleMobileMenu = new EventEmitter<void>();

  notifications = 3;

  onMenuToggle(): void {
    this.toggleMobileMenu.emit();
  }

}
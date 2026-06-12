import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {

  @Input() isMobileSidebarOpen = signal(false);

  paymentProductsExpanded = true;

  togglePaymentProducts(): void {
    this.paymentProductsExpanded = !this.paymentProductsExpanded;
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }

}
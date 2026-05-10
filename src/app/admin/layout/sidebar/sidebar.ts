import { Component } from '@angular/core';
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

  mastersExpanded = true;
  merchantExpanded = false;
  reportExpanded = false;
  settingsExpanded = false;

  toggleMasters(): void {
    this.mastersExpanded = !this.mastersExpanded;
  }

  toggleMerchant(): void {
    this.merchantExpanded = !this.merchantExpanded;
  }

  toggleReport(): void {
    this.reportExpanded = !this.reportExpanded;
  }

  toggleSettings(): void {
    this.settingsExpanded = !this.settingsExpanded;
  }

}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-developer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './developer.html',
  styleUrl: './developer.scss',
})
export class Developer {

  activeTab: string = 'apiKeys';

  showPasswordModal = false;
  password = '';

  apiKey = 'LHps9s';
  salt = '***************';

  clientId = 'banku_client_id';
  clientSecret = '********************************';

  isVerified = false;

  openPasswordModal(): void {
    this.showPasswordModal = true;
    this.password = '';
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
  }

  verifyPassword(): void {

    if (!this.password.trim()) {
      alert('Please enter password');
      return;
    }

    this.isVerified = true;
    this.showPasswordModal = false;
  }

  copyText(value: string): void {
    navigator.clipboard.writeText(value);
  }

  regenerateSalt(): void {
    alert('Salt regenerated successfully');
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }
}
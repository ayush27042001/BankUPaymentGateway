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

  if (!value) {
    return;
  }

  if (
    navigator &&
    navigator.clipboard &&
    window.isSecureContext
  ) {

    navigator.clipboard.writeText(value)
      .then(() => {

        alert('Copied Successfully');

      })
      .catch(() => {

        this.fallbackCopy(value);

      });

    return;
  }

  this.fallbackCopy(value);
}

private fallbackCopy(
  value: string
): void {

  const textarea =
    document.createElement('textarea');

  textarea.value = value;

  textarea.style.position = 'fixed';
  textarea.style.left = '-999999px';
  textarea.style.top = '-999999px';

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  try {

    document.execCommand('copy');

    alert('Copied Successfully');

  } catch {

    alert('Copy Failed');

  }

  document.body.removeChild(textarea);
}

  regenerateSalt(): void {
    alert('Salt regenerated successfully');
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }
}
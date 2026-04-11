import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-onboarding-header',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './onboarding-header.html',
  styleUrl: './onboarding-header.scss',
})
export class OnboardingHeaderComponent {
  @Input() title: string = 'Account Creation';
  @Input() currentStep: number = 1;
  @Input() merchantId: string = '13574280';
  @Input() showActions: boolean = true;

  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
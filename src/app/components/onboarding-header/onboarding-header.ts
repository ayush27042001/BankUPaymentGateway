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
  // Header title displayed in the center
  @Input() title: string = 'Account Creation';

  // Current active step
  @Input() currentStep: number = 1;

  // Merchant id displayed on the left side
  @Input() merchantId: string = '13574280';

  // Controls action buttons visibility
  @Input() showActions: boolean = true;

  // Controls mobile action menu state
  mobileMenuOpen = false;

  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Close mobile menu
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
import { Component, Input, inject } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-onboarding-header',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './onboarding-header.html',
  styleUrl: './onboarding-header.scss',
})
export class OnboardingHeaderComponent {
  private authService = inject(AuthService);

  // Header title displayed in the center
  @Input() title: string = 'Account Creation';

  // Current active step
  @Input() currentStep: number = 1;

  // Merchant id displayed on the left side
  @Input() set merchantId(value: string | undefined) {
    if (value && value.trim() !== '') {
      this._merchantId = value;
    }
  }
  
  get merchantId(): string {
    return this._merchantId || this.authService.getMid() || '';
  }
  
  private _merchantId: string = '';

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
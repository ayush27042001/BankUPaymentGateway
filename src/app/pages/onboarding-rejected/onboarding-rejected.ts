import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding-rejected',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-rejected.html',
  styleUrl: './onboarding-rejected.scss'
})
export class OnboardingRejectedComponent {
  constructor(private router: Router) {}

  contactEmail: string = 'info@banku.co.in';

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}

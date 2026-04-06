import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-onboarding-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-header.html',
  styleUrl: './onboarding-header.scss',
})
export class OnboardingHeaderComponent {
  @Input() title: string = 'Account Creation';
  @Input() currentStep: number = 1;
  @Input() merchantId: string = '13574280';
  @Input() showActions: boolean = true;
}
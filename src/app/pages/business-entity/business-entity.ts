import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingHeaderComponent } from '../../components/onboarding-header/onboarding-header';

@Component({
  selector: 'app-business-entity',
  standalone: true,
  imports: [CommonModule, OnboardingHeaderComponent],
  templateUrl: './business-entity.html',
  styleUrl: './business-entity.scss',
})
export class BusinessEntityComponent {
  selectedType = 'Individual';

  constructor(private router: Router) {}

  selectType(type: string): void {
    this.selectedType = type;
  }

  onConfirm(): void {
    this.router.navigate(['/phone-ckyc']);
  }
  goBack(): void {
    this.router.navigate(['']);
  }

}
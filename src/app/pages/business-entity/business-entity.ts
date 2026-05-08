import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { OnboardingHeaderComponent } from '../../components/onboarding-header/onboarding-header';
import { BusinessEntityService } from '../../services/business-entity/business-entity.service';
import { AuthService } from '../../services/auth/auth.service';
import { BusinessEntityType, BusinessEntity } from '../../models/business-entity/business-entity.models';

@Component({
  selector: 'app-business-entity',
  standalone: true,
  imports: [CommonModule, OnboardingHeaderComponent],
  templateUrl: './business-entity.html',
  styleUrl: './business-entity.scss',
})
export class BusinessEntityComponent implements OnInit {
  businessEntityTypes: BusinessEntityType[] = [];
  selectedType: BusinessEntityType | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private businessEntityService: BusinessEntityService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('BusinessEntityComponent ngOnInit called');
    this.loadBusinessEntityTypes();
    this.loadExistingBusinessEntity();
  }

  loadBusinessEntityTypes(): void {
    console.log('loadBusinessEntityTypes called');
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    console.log('Loading business entity types...');
    console.log('BusinessEntityService:', this.businessEntityService);
    const observable = this.businessEntityService.getBusinessEntityTypes();
    console.log('Observable created:', observable);
    observable.subscribe({
      next: (response) => {
        console.log('Business entity types response:', response);
        if (response.success && response.data) {
          this.businessEntityTypes = response.data;
          console.log('Business entity types set:', this.businessEntityTypes);
          if (this.businessEntityTypes.length > 0) {
            this.selectedType = this.businessEntityTypes[0];
            console.log('Selected type set:', this.selectedType);
          }
        }
        this.loading = false;
        console.log('Loading set to false');
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading business entity types:', err);
        this.error = 'Failed to load business entity types';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadExistingBusinessEntity(): void {
    console.log('Loading existing business entity...');
    this.businessEntityService.getBusinessEntity().subscribe({
      next: (response) => {
        console.log('Existing business entity response:', response);
        if (response.success && response.data) {
          const existingEntity = response.data;
          console.log('Existing entity found:', existingEntity);
          // Pre-select the existing entity type
          const matchingType = this.businessEntityTypes.find(
            (type) => type.businessEntityTypeId === existingEntity.businessEntityTypeId
          );
          if (matchingType) {
            this.selectedType = matchingType;
            console.log('Pre-selected existing entity type:', this.selectedType);
            this.cdr.markForCheck();
          }
        }
      },
      error: (err) => {
        // 404 is expected if business entity not set yet
        if (err.status === 404) {
          console.log('No existing business entity found (404)');
        } else {
          console.error('Error loading existing business entity:', err);
        }
      }
    });
  }

  selectType(type: BusinessEntityType): void {
    this.selectedType = type;
  }

  onConfirm(): void {
    if (this.selectedType) {
      console.log('Saving business entity:', this.selectedType);
      this.businessEntityService.saveBusinessEntity({
        businessEntityTypeId: this.selectedType.businessEntityTypeId,
      }).subscribe({
        next: (response) => {
          console.log('Save business entity response:', response);
          if (response.success && response.data) {
            // Update auth service with new onboarding status
            this.authService.setAuthData(
              this.authService.getToken() || '',
              this.authService.getUserId() || '',
              this.authService.getMid() || '',
              this.authService.getUserData(),
              this.authService.getRefreshToken() || undefined,
              this.authService.getTokenExpiration() || undefined,
              this.authService.getRefreshTokenExpiration() || undefined,
              response.data.onboardingStatus
            );
            console.log('Onboarding status updated');
            this.router.navigate(['/phone-ckyc']);
          }
        },
        error: (err) => {
          console.error('Error saving business entity:', err);
          // Toast error will be shown by interceptor
        }
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/pan-verification']);
  }

}
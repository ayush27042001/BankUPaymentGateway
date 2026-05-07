import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnboardingHeaderComponent } from '../../components/onboarding-header/onboarding-header';
import { BusinessEntityService } from '../../services/business-entity/business-entity.service';
import { AuthService } from '../../services/auth/auth.service';
import { BusinessCategory, SubCategory } from '../../models/business-entity/business-entity.models';

interface BusinessCategoryGroup {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-business-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent],
  templateUrl: './business-category.html',
  styleUrl: './business-category.scss',
})
export class BusinessCategoryComponent implements OnInit {
  businessCategoryForm: FormGroup;

  showDropdown = false;
  selectedCategory = '';
  loading = false;
  error: string | null = null;

  categoryGroups: BusinessCategoryGroup[] = [];
  filteredGroups: BusinessCategoryGroup[] = [];
  allCategories: BusinessCategory[] = [];

  selectedBusinessCategoryId: number | null = null;
  selectedBusinessSubCategoryId: number | null = null;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private businessEntityService: BusinessEntityService,
    private authService: AuthService
  ) {
    this.businessCategoryForm = this.fb.group({
      businessCategory: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadBusinessCategories();
    this.loadExistingBusinessCategory();
  }

  get f() {
    return this.businessCategoryForm.controls;
  }

  loadBusinessCategories(): void {
    this.loading = true;
    this.error = null;
    this.businessEntityService.getBusinessCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.allCategories = response.data;
          this.categoryGroups = this.mapToCategoryGroups(response.data);
          this.filteredGroups = this.categoryGroups;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading business categories:', err);
        this.error = 'Failed to load business categories';
        this.loading = false;
      }
    });
  }

  loadExistingBusinessCategory(): void {
    this.businessEntityService.getBusinessCategory().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const existingCategory = response.data;
          this.selectedCategory = existingCategory.subCategoryName;
          this.selectedBusinessCategoryId = existingCategory.businessCategoryId;
          this.selectedBusinessSubCategoryId = existingCategory.businessSubCategoryId;
          this.businessCategoryForm.patchValue({
            businessCategory: existingCategory.subCategoryName,
          });
        }
      },
      error: (err) => {
        if (err.status === 404) {
          console.log('No existing business category found (404)');
        } else {
          console.error('Error loading existing business category:', err);
        }
      }
    });
  }

  mapToCategoryGroups(categories: BusinessCategory[]): BusinessCategoryGroup[] {
    return categories.map(category => ({
      title: category.categoryName,
      items: category.subCategories.map(sub => sub.subCategoryName)
    })).filter(group => group.items.length > 0);
  }

  openDropdown(): void {
    this.showDropdown = true;
  }

  closeDropdown(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150);
  }

  onSearchInput(): void {
    const value = (this.businessCategoryForm.get('businessCategory')?.value || '')
      .toString()
      .trim()
      .toLowerCase();

    this.showDropdown = true;

    if (!value) {
      this.filteredGroups = this.categoryGroups;
      return;
    }

    this.filteredGroups = this.categoryGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(value)),
      }))
      .filter((group) => group.items.length > 0);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.businessCategoryForm.patchValue({
      businessCategory: category,
    });
    this.businessCategoryForm.get('businessCategory')?.markAsTouched();
    this.showDropdown = false;

    this.findCategoryIds(category);
  }

  findCategoryIds(subCategoryName: string): void {
    for (const category of this.allCategories) {
      const subCategory = category.subCategories.find(
        sub => sub.subCategoryName === subCategoryName
      );
      if (subCategory) {
        this.selectedBusinessCategoryId = category.businessCategoryId;
        this.selectedBusinessSubCategoryId = subCategory.businessSubCategoryId;
        break;
      }
    }
  }

  onProceed(): void {
    this.businessCategoryForm.markAllAsTouched();

    if (this.businessCategoryForm.invalid) {
      return;
    }

    if (!this.selectedBusinessCategoryId || !this.selectedBusinessSubCategoryId) {
      console.error('Category IDs not set');
      return;
    }

    this.saving = true;
    this.businessEntityService.saveBusinessCategory({
      businessCategoryId: this.selectedBusinessCategoryId,
      businessSubCategoryId: this.selectedBusinessSubCategoryId,
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
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
          this.router.navigate(['/share-business-details']);
        }
        this.saving = false;
      },
      error: (err) => {
        console.error('Error saving business category:', err);
        this.saving = false;
      }
    });
  }
goBack(): void {
    this.router.navigate(['/phone-ckyc']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.category-search-wrap')) {
      this.showDropdown = false;
    }
  }
}
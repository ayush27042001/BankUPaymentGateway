import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OnboardingHeaderComponent } from '../../components/onboarding-header/onboarding-header';

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
export class BusinessCategoryComponent {
  businessCategoryForm: FormGroup;

  showDropdown = false;
  selectedCategory = '';

  categoryGroups: BusinessCategoryGroup[] = [
    {
      title: 'ARTS, GIFTS & STATIONERY',
      items: [
        'Art and Craft Supply',
        'Art Dealers and Galleries',
        'Book Stores',
        'Florists',
        'Gifts and Souvenir Shops',
        'Hobby, Toy, and Game Shops',
        'Sporting Goods Stores',
        'Stationery and School Supply Stores',
      ],
    },
    {
      title: 'FASHION & APPAREL',
      items: [
        'Women Clothing Stores',
        'Men Clothing Stores',
        'Kids Wear Stores',
        'Footwear Stores',
        'Fashion Accessories',
        'Boutiques',
      ],
    },
    {
      title: 'FOOD & GROCERY',
      items: [
        'Grocery Stores',
        'Bakery Shops',
        'Sweet Shops',
        'Dairy Products',
        'Organic Food Stores',
      ],
    },
  ];

  filteredGroups: BusinessCategoryGroup[] = [];

  constructor(private fb: FormBuilder, private router: Router) {
    this.businessCategoryForm = this.fb.group({
      businessCategory: ['', Validators.required],
    });

    this.filteredGroups = this.categoryGroups;
  }

  get f() {
    return this.businessCategoryForm.controls;
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
  }

  onProceed(): void {
  this.businessCategoryForm.markAllAsTouched();

  if (this.businessCategoryForm.invalid) {
    return;
  }

  // Navigate to next page
  this.router.navigate(['/share-business-details']);
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
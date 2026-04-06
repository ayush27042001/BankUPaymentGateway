import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnboardingHeaderComponent } from '../../components/onboarding-header/onboarding-header';

interface CategoryGroup {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-business-category',
  standalone: true,
  imports: [CommonModule, FormsModule, OnboardingHeaderComponent],
  templateUrl: './business-category.html',
  styleUrl: './business-category.scss',
})
export class BusinessCategoryComponent {
  searchText = '';
  selectedCategory = '';
  showDropdown = false;

  categoryGroups: CategoryGroup[] = [
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
        'Women Clothing Store',
        'Men Clothing Store',
        'Kids Wear Store',
        'Boutique and Designer Store',
        'Footwear Store',
        'Accessories Store',
      ],
    },
    {
      title: 'FOOD & GROCERY',
      items: [
        'General Grocery Store',
        'Bakery and Confectionery',
        'Sweet Shop',
        'Restaurant and Cafe',
        'Organic Food Store',
        'Dairy Products Store',
      ],
    },
  ];

  get filteredGroups(): CategoryGroup[] {
    const keyword = this.searchText.trim().toLowerCase();

    if (!keyword) {
      return this.categoryGroups;
    }

    return this.categoryGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.toLowerCase().includes(keyword) ||
          group.title.toLowerCase().includes(keyword)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }

  openDropdown(): void {
    this.showDropdown = true;
  }

  onSearchInput(): void {
    this.showDropdown = true;
    this.selectedCategory = '';
  }

  selectCategory(item: string): void {
    this.searchText = item;
    this.selectedCategory = item;
    this.showDropdown = false;
  }

  clearSelection(): void {
    this.searchText = '';
    this.selectedCategory = '';
    this.showDropdown = true;
  }

  onBack(): void {
    console.log('Back clicked');
  }

  onConfirm(): void {
    if (!this.selectedCategory) return;

    console.log('Selected Category:', this.selectedCategory);
    // yahan next route / API call laga dena
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.search-dropdown-wrap');

    if (!clickedInside) {
      this.showDropdown = false;
    }
  }
}
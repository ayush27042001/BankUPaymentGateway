import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './business-categories.html',
  styleUrl: './business-categories.scss',
})
export class BusinessCategories {

  /* =========================================
     SEARCH
  ========================================= */

  searchTerm: string = '';

  /* =========================================
     PAGINATION
  ========================================= */

  currentPage: number = 1;

  itemsPerPage: number = 5;

  /* =========================================
     VIEW MODAL
  ========================================= */

  showViewModal: boolean = false;

  selectedCategory: any = null;

  /* =========================================
     ADD MODAL
  ========================================= */

  showAddModal: boolean = false;

  /* =========================================
     NEW CATEGORY MODEL
  ========================================= */

  newCategory = {
    categoryName: '',
    categoryCode: '',
    description: '',
    isActive: true,
  };

  /* =========================================
     BUSINESS CATEGORY DATA
  ========================================= */

  businessCategories = [

    {
      businessCategoryID: 1,
      categoryName: 'ARTS, GIFTS & STATIONERY',
      categoryCode: 'AGS',
      description: 'Arts, Gifts and Stationery items',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 2,
      categoryName: 'FASHION & APPAREL',
      categoryCode: 'FA',
      description: 'Fashion and Apparel',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 3,
      categoryName: 'ELECTRONICS',
      categoryCode: 'ELEC',
      description: 'Electronics and Gadgets',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 4,
      categoryName: 'FOOD & BEVERAGES',
      categoryCode: 'FB',
      description: 'Food and Beverages',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 5,
      categoryName: 'HEALTH & WELLNESS',
      categoryCode: 'HW',
      description: 'Health and Wellness products',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 6,
      categoryName: 'HOME & FURNITURE',
      categoryCode: 'HF',
      description: 'Home and Furniture',
      isActive: false,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 7,
      categoryName: 'TRAVEL & TRANSPORT',
      categoryCode: 'TT',
      description: 'Travel and Transportation',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 8,
      categoryName: 'EDUCATION',
      categoryCode: 'EDU',
      description: 'Educational Services',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 9,
      categoryName: 'ENTERTAINMENT',
      categoryCode: 'ENT',
      description: 'Entertainment and Media',
      isActive: false,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessCategoryID: 10,
      categoryName: 'SERVICES',
      categoryCode: 'SERV',
      description: 'Professional Services',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    }

  ];

  /* =========================================
     FILTERED DATA
  ========================================= */

  filteredCategories = [...this.businessCategories];

  /* =========================================
     FILTER CATEGORY
  ========================================= */

  filterCategories(): void {

    const search = this.searchTerm
      .toLowerCase()
      .trim();

    if (!search) {

      this.filteredCategories = [
        ...this.businessCategories
      ];

      return;

    }

    this.filteredCategories =
      this.businessCategories.filter((category) => {

        return (

          category.businessCategoryID
            .toString()
            .includes(search)

          ||

          category.categoryName
            .toLowerCase()
            .includes(search)

          ||

          category.categoryCode
            .toLowerCase()
            .includes(search)

          ||

          category.description
            .toLowerCase()
            .includes(search)

          ||

          (category.isActive
            ? 'active'
            : 'inactive'
          ).includes(search)

        );

      });

  }

  /* =========================================
     PAGINATED DATA
  ========================================= */

  paginatedData() {

    const startIndex =
      (this.currentPage - 1)
      * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    return this.filteredCategories.slice(
      startIndex,
      endIndex
    );

  }

  /* =========================================
     TOTAL PAGES
  ========================================= */

  get totalPages(): number {

    return Math.ceil(
      this.filteredCategories.length
      / this.itemsPerPage
    );

  }

  /* =========================================
     NEXT PAGE
  ========================================= */

  nextPage(): void {

    if (
      this.currentPage
      < this.totalPages
    ) {

      this.currentPage++;

    }

  }

  /* =========================================
     PREVIOUS PAGE
  ========================================= */

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

    }

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(category: any): void {

    this.selectedCategory = category;

    this.showViewModal = true;

    document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE VIEW MODAL
  ========================================= */

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedCategory = null;

    document.body.style.overflow = 'auto';

  }

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  openAddModal(): void {

    this.showAddModal = true;

    document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  closeAddModal(): void {

    this.showAddModal = false;

    document.body.style.overflow = 'auto';

    this.resetNewCategory();

  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetNewCategory(): void {

    this.newCategory = {
      categoryName: '',
      categoryCode: '',
      description: '',
      isActive: true,
    };

  }

  /* =========================================
     ADD CATEGORY
  ========================================= */

  addCategory(): void {

    if (
      !this.newCategory.categoryName.trim()
      ||
      !this.newCategory.categoryCode.trim()
      ||
      !this.newCategory.description.trim()
    ) {

      alert('Please fill all required fields.');

      return;

    }

    const currentDate =
      new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

    const newEntry = {

      businessCategoryID:
        this.businessCategories.length + 1,

      categoryName:
        this.newCategory.categoryName,

      categoryCode:
        this.newCategory.categoryCode
          .toUpperCase(),

      description:
        this.newCategory.description,

      isActive:
        this.newCategory.isActive,

      createdDate:
        currentDate,

      updatedDate:
        currentDate,

    };

    this.businessCategories.unshift(newEntry);

    this.filteredCategories = [
      ...this.businessCategories
    ];

    this.closeAddModal();

  }

  /* =========================================
     APPROVE CATEGORY
  ========================================= */

  approveCategory(): void {

    if (!this.selectedCategory) {
      return;
    }

    this.selectedCategory.isActive = true;

    this.selectedCategory.updatedDate =
      new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

    this.closeViewModal();

  }

  /* =========================================
     REJECT CATEGORY
  ========================================= */

  rejectCategory(): void {

    if (!this.selectedCategory) {
      return;
    }

    this.selectedCategory.isActive = false;

    this.selectedCategory.updatedDate =
      new Date().toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }
      );

    this.closeViewModal();

  }

  /* =========================================
     EXPORT CSV
  ========================================= */

  exportCSV(): void {

    const headers = [
      'ID',
      'Category Name',
      'Category Code',
      'Description',
      'Status',
      'Created Date',
      'Updated Date'
    ];

    const rows =
      this.filteredCategories.map((category) => [

        category.businessCategoryID,

        category.categoryName,

        category.categoryCode,

        category.description,

        category.isActive
          ? 'Active'
          : 'Inactive',

        category.createdDate,

        category.updatedDate

      ]);

    const csvContent = [

      headers.join(','),

      ...rows.map((row) => row.join(','))

    ].join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const link =
      document.createElement('a');

    const url =
      URL.createObjectURL(blob);

    link.setAttribute('href', url);

    link.setAttribute(
      'download',
      'business-categories.csv'
    );

    link.style.visibility = 'hidden';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }

  /* =========================================
     EDIT MODAL
  ========================================= */

  showEditModal: boolean = false;

  editCategory: any = {
    businessCategoryID: 0,
    categoryName: '',
    categoryCode: '',
    description: '',
    isActive: true,
    createdDate: '',
    updatedDate: ''
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  openEditModal(category: any): void {

    this.editCategory = {
      ...category
    };

    this.showEditModal = true;

    document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE EDIT MODAL
  ========================================= */

  closeEditModal(): void {

    this.showEditModal = false;

    document.body.style.overflow = 'auto';

  }

  /* =========================================
     UPDATE CATEGORY
  ========================================= */

  updateCategory(): void {

    if (
      !this.editCategory.categoryName.trim()
      ||
      !this.editCategory.categoryCode.trim()
      ||
      !this.editCategory.description.trim()
    ) {

      alert(
        'Please fill all required fields.'
      );

      return;

    }

    const index =
      this.businessCategories.findIndex(
        (cat) =>
          cat.businessCategoryID ===
          this.editCategory.businessCategoryID
      );

    if (index !== -1) {

      this.businessCategories[index] = {

        ...this.editCategory,

        categoryCode:
          this.editCategory.categoryCode
            .toUpperCase(),

        updatedDate:
          new Date().toLocaleDateString(
            'en-GB',
            {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }
          )

      };

      this.filteredCategories = [
        ...this.businessCategories
      ];

    }

    this.closeEditModal();

  }

}
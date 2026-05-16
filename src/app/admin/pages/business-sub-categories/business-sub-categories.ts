import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-business-sub-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './business-sub-categories.html',
  styleUrl: './business-sub-categories.scss',
})
export class BusinessSubCategories {

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

  selectedSubCategory: any = null;

  /* =========================================
     ADD MODAL
  ========================================= */

  showAddModal: boolean = false;

  /* =========================================
     CATEGORY LIST
  ========================================= */

  categories: string[] = [

    'ARTS, GIFTS & STATIONERY',

    'FASHION & APPAREL',

    'ELECTRONICS',

    'FOOD & BEVERAGES',

    'HEALTH & WELLNESS',

    'HOME & FURNITURE',

    'TRAVEL & TRANSPORT',

    'EDUCATION',

    'ENTERTAINMENT',

    'SERVICES'

  ];

  /* =========================================
     NEW SUB CATEGORY MODEL
  ========================================= */

  newSubCategory = {

    categoryName: '',

    subCategoryName: '',

    subCategoryCode: '',

    description: '',

    isActive: true,

  };

  /* =========================================
     SUB CATEGORY DATA
  ========================================= */

  businessSubCategories = [

    {
      businessSubCategoryID: 1,
      businessCategoryID: 1,
      categoryName: 'ARTS, GIFTS & STATIONERY',
      subCategoryName: 'Art and Craft Supply',
      subCategoryCode: 'ACS',
      description: 'Art and craft related products',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 2,
      businessCategoryID: 1,
      categoryName: 'ARTS, GIFTS & STATIONERY',
      subCategoryName: 'Florists',
      subCategoryCode: 'FLOR',
      description: 'Flower and florist services',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 3,
      businessCategoryID: 1,
      categoryName: 'ARTS, GIFTS & STATIONERY',
      subCategoryName: 'Gifts and Novelties',
      subCategoryCode: 'GIFT',
      description: 'Gift and novelty items',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 4,
      businessCategoryID: 1,
      categoryName: 'ARTS, GIFTS & STATIONERY',
      subCategoryName: 'Stationery',
      subCategoryCode: 'STAT',
      description: 'Stationery and office items',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 5,
      businessCategoryID: 2,
      categoryName: 'FASHION & APPAREL',
      subCategoryName: 'Clothing and Apparel',
      subCategoryCode: 'CLTH',
      description: 'Fashion clothing products',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 6,
      businessCategoryID: 2,
      categoryName: 'FASHION & APPAREL',
      subCategoryName: 'Footwear',
      subCategoryCode: 'FOOT',
      description: 'Shoes and footwear products',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 7,
      businessCategoryID: 2,
      categoryName: 'FASHION & APPAREL',
      subCategoryName: 'Accessories',
      subCategoryCode: 'ACCS',
      description: 'Fashion accessories',
      isActive: false,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 8,
      businessCategoryID: 3,
      categoryName: 'ELECTRONICS',
      subCategoryName: 'Mobile Phones',
      subCategoryCode: 'MOBL',
      description: 'Mobile and smartphone products',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 9,
      businessCategoryID: 3,
      categoryName: 'ELECTRONICS',
      subCategoryName: 'Computers and Laptops',
      subCategoryCode: 'COMP',
      description: 'Computers and laptops',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      businessSubCategoryID: 10,
      businessCategoryID: 3,
      categoryName: 'ELECTRONICS',
      subCategoryName: 'Consumer Electronics',
      subCategoryCode: 'CELEC',
      description: 'Electronic consumer products',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    }

  ];

  /* =========================================
     FILTERED DATA
  ========================================= */

  filteredSubCategories = [
    ...this.businessSubCategories
  ];

  /* =========================================
     PAGINATED DATA
  ========================================= */

  get paginatedSubCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredSubCategories.slice(startIndex, endIndex);
  }

  /* =========================================
     TOTAL PAGES
  ========================================= */

  get totalPages(): number {
    return Math.ceil(this.filteredSubCategories.length / this.itemsPerPage);
  }

  /* =========================================
     PAGINATION CONTROLS
  ========================================= */

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  /* =========================================
     FILTER SUB CATEGORIES
  ========================================= */

  filterSubCategories(): void {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();

    this.currentPage = 1;

    if (!search) {

      this.filteredSubCategories = [
        ...this.businessSubCategories
      ];

      return;

    }

    this.filteredSubCategories =
      this.businessSubCategories.filter((subCategory) => {

        return (

          subCategory.businessSubCategoryID
            .toString()
            .includes(search)

          ||

          subCategory.categoryName
            .toLowerCase()
            .includes(search)

          ||

          subCategory.subCategoryName
            .toLowerCase()
            .includes(search)

          ||

          subCategory.subCategoryCode
            .toLowerCase()
            .includes(search)

          ||

          subCategory.description
            .toLowerCase()
            .includes(search)

          ||

          (
            subCategory.isActive
              ? 'active'
              : 'inactive'
          ).includes(search)

        );

      });

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(subCategory: any): void {

    this.selectedSubCategory = subCategory;

    this.showViewModal = true;

    document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE VIEW MODAL
  ========================================= */

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedSubCategory = null;

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

    this.resetForm();

  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {

    this.newSubCategory = {

      categoryName: '',

      subCategoryName: '',

      subCategoryCode: '',

      description: '',

      isActive: true,

    };

  }

  /* =========================================
     ADD SUB CATEGORY
  ========================================= */

  addSubCategory(): void {

    if (
      !this.newSubCategory.categoryName.trim()
      ||
      !this.newSubCategory.subCategoryName.trim()
      ||
      !this.newSubCategory.subCategoryCode.trim()
    ) {

      alert(
        'Please fill all required fields.'
      );

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

      businessSubCategoryID:
        this.businessSubCategories.length + 1,

      businessCategoryID: 0,

      categoryName:
        this.newSubCategory.categoryName,

      subCategoryName:
        this.newSubCategory.subCategoryName,

      subCategoryCode:
        this.newSubCategory.subCategoryCode
          .toUpperCase(),

      description:
        this.newSubCategory.description,

      isActive:
        this.newSubCategory.isActive,

      createdDate:
        currentDate,

      updatedDate:
        currentDate,

    };

    this.businessSubCategories.unshift(
      newEntry
    );

    this.filteredSubCategories = [
      ...this.businessSubCategories
    ];

    this.closeAddModal();

  }

  /* =========================================
     APPROVE
  ========================================= */

  approveSubCategory(): void {

    if (!this.selectedSubCategory) {
      return;
    }

    this.selectedSubCategory.isActive = true;

    this.selectedSubCategory.updatedDate =
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
     REJECT
  ========================================= */

  rejectSubCategory(): void {

    if (!this.selectedSubCategory) {
      return;
    }

    this.selectedSubCategory.isActive = false;

    this.selectedSubCategory.updatedDate =
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

      'Sub Category Name',

      'Sub Category Code',

      'Description',

      'Status',

      'Created Date',

      'Updated Date'

    ];

    const rows =
      this.filteredSubCategories.map(
        (subCategory) => [

          subCategory.businessSubCategoryID,

          subCategory.categoryName,

          subCategory.subCategoryName,

          subCategory.subCategoryCode,

          subCategory.description,

          subCategory.isActive
            ? 'Active'
            : 'Inactive',

          subCategory.createdDate,

          subCategory.updatedDate

        ]
      );

    const csvContent = [

      headers.join(','),

      ...rows.map((row) =>
        row.join(',')
      )

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
      'business-sub-categories.csv'
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

  editSubCategory: any = {
    businessSubCategoryID: 0,
    businessCategoryID: 0,
    categoryName: '',
    subCategoryName: '',
    subCategoryCode: '',
    description: '',
    isActive: true,
    createdDate: '',
    updatedDate: ''
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  openEditModal(subCategory: any): void {

    this.editSubCategory = {
      ...subCategory
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
     UPDATE SUB CATEGORY
  ========================================= */

  updateSubCategory(): void {

    if (
      !this.editSubCategory.subCategoryName.trim()
      ||
      !this.editSubCategory.subCategoryCode.trim()
      ||
      !this.editSubCategory.description.trim()
    ) {

      alert(
        'Please fill all required fields.'
      );

      return;

    }

    const index =
      this.businessSubCategories.findIndex(
        (subCat) =>
          subCat.businessSubCategoryID ===
          this.editSubCategory.businessSubCategoryID
      );

    if (index !== -1) {

      this.businessSubCategories[index] = {

        ...this.editSubCategory,

        subCategoryCode:
          this.editSubCategory.subCategoryCode
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

      this.filteredSubCategories = [
        ...this.businessSubCategories
      ];

    }

    this.closeEditModal();

  }

}
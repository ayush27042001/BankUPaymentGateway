import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HorizontalTableScrollDirective } from '../../../shared/directives/horizontal-table-scroll.directive';
import {
  BusinessCategoryService,
  AddBusinessCategoryRequest
} from '../../services/business-category.service';
@Component({
  selector: 'app-business-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HorizontalTableScrollDirective
  ],
  templateUrl: './business-categories.html',
  styleUrl: './business-categories.scss',
})
export class BusinessCategories implements OnInit {

  private businessCategoryService = inject(BusinessCategoryService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadBusinessCategories();
  }
  /* =========================================
     SEARCH
  ========================================= */

  searchTerm: string = '';

  /* =========================================
     PAGINATION
  ========================================= */

  currentPage: number = 1;

  itemsPerPage: number = 5;

  totalCount: number = 0;

  hasPreviousPage: boolean = false;

  hasNextPage: boolean = false;

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

  businessCategories: any[] = [];

  /* =========================================
     FILTERED DATA
  ========================================= */

  filteredCategories: any[] = [];

  /* =========================================
     FILTER CATEGORY
  ========================================= */

  filterCategories(): void {

    this.currentPage = 1;

    this.loadBusinessCategories(
      this.currentPage,
      this.itemsPerPage,
      this.searchTerm
    );

  }

  /* =========================================
     LOAD BUSINESS CATEGORIES
  ========================================= */

  loadBusinessCategories(
    pageNumber: number = this.currentPage,
    pageSize: number = this.itemsPerPage,
    search: string = this.searchTerm,
    isActive: boolean | null = null
  ): void {

    this.businessCategoryService
      .getBusinessCategoriesList(
        pageNumber,
        pageSize,
        search,
        isActive
      )
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.businessCategories =
              response.data.items.map((item: any) => ({

                businessCategoryID: item.businessCategoryId,

                categoryName: item.categoryName,

                categoryCode: item.categoryCode,

                description: item.description,

                isActive: item.isActive,

                createdDate: item.createdDate,

                updatedDate: item.updatedDate

              }));

            this.filteredCategories = [
              ...this.businessCategories
            ];

            this.currentPage = response.data.pageNumber;
            this.itemsPerPage = response.data.pageSize;
            this.totalCount = response.data.totalCount;
            this.hasPreviousPage = response.data.hasPreviousPage;
            this.hasNextPage = response.data.hasNextPage;

          }

          this.cdr.markForCheck();

        },

        error: (err: any) => {

          console.error(err);

          this.toastr.error(
            'Failed to load Business Categories.',
            'Error'
          );

        }

      });

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

    if (this.hasNextPage) {

      this.loadBusinessCategories(
        this.currentPage + 1,
        this.itemsPerPage,
        this.searchTerm
      );

    }

  }

  /* =========================================
     PREVIOUS PAGE
  ========================================= */

  previousPage(): void {

    if (this.hasPreviousPage) {

      this.loadBusinessCategories(
        this.currentPage - 1,
        this.itemsPerPage,
        this.searchTerm
      );

    }

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(category: any): void {

    this.businessCategoryService
      .getBusinessCategoryById(category.businessCategoryID)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.selectedCategory = {

              businessCategoryID: response.data.businessCategoryId,

              categoryName: response.data.categoryName,

              categoryCode: response.data.categoryCode,

              description: response.data.description,

              isActive: response.data.isActive,

              createdDate: response.data.createdDate,

              updatedDate: response.data.updatedDate

            };

            this.showViewModal = true;

            document.body.style.overflow = 'hidden';

          } else {

            this.toastr.error(
              response.message,
              'Error'
            );

          }

        },

        error: (err: any) => {

          console.error(err);

          const message =
            err?.error?.message ||
            'Something went wrong.';

          this.toastr.error(message, 'Error');

        }

      });

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

    this.cdr.detectChanges();

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
    !this.newCategory.categoryName.trim() ||
    !this.newCategory.categoryCode.trim() ||
    !this.newCategory.description.trim()
  ) {

    this.toastr.warning(
      'Please fill all required fields.',
      'Validation'
    );
    return;

  }

  const request: AddBusinessCategoryRequest = {

    categoryName: this.newCategory.categoryName,
    categoryCode: this.newCategory.categoryCode.toUpperCase(),
    description: this.newCategory.description,
    isActive: this.newCategory.isActive

  };

  this.businessCategoryService
    .addBusinessCategory(request)
    .subscribe({

      next: (response: any) => {

        if (response.success) {

          this.toastr.success(
            response.message,
            'Success'
          );

          this.resetNewCategory();
          this.closeAddModal();
          this.loadBusinessCategories();

        } else {

          this.toastr.error(
            response.message,
            'Error'
          );

        }

      },

      error: (error) => {

        console.error(error);

        const message =
          error?.error?.message ||
          'Something went wrong.';

        this.toastr.error(message, 'Error');

      }

    });

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

    this.cdr.detectChanges();

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

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    const payload = {

      businessCategoryId: this.editCategory.businessCategoryID,

      categoryName: this.editCategory.categoryName,

      categoryCode: this.editCategory.categoryCode.toUpperCase(),

      description: this.editCategory.description,

      isActive: this.editCategory.isActive

    };

    this.businessCategoryService
      .updateBusinessCategory(payload)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.toastr.success(
              response.message,
              'Success'
            );

            this.closeEditModal();
            this.loadBusinessCategories();

          } else {

            this.toastr.error(
              response.message,
              'Error'
            );

          }

        },

        error: (err: any) => {

          const message =
            err?.error?.message ||
            'Something went wrong.';

          this.toastr.error(message, 'Error');

        }

      });

  }

}
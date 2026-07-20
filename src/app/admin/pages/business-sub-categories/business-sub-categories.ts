import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HorizontalTableScrollDirective } from '../../../shared/directives/horizontal-table-scroll.directive';
import {
  BusinessSubCategoryService,
  AddBusinessSubCategoryRequest
} from '../../services/business-sub-category.service';

@Component({
  selector: 'app-business-sub-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HorizontalTableScrollDirective
  ],
  templateUrl: './business-sub-categories.html',
  styleUrl: './business-sub-categories.scss',
})
export class BusinessSubCategories implements OnInit {

  private subCategoryService = inject(BusinessSubCategoryService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadBusinessSubCategories();
    this.loadCategories();
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
  selectedSubCategory: any = null;

  /* =========================================
     ADD MODAL
  ========================================= */

  showAddModal: boolean = false;

  /* =========================================
     CATEGORY LIST (from API)
  ========================================= */

  categories: any[] = [];

  /* =========================================
     NEW SUB CATEGORY MODEL
  ========================================= */

  newSubCategory = {
    businessCategoryId: 0,
    categoryName: '',
    subCategoryName: '',
    subCategoryCode: '',
    description: '',
    isActive: true,
  };

  /* =========================================
     SUB CATEGORY DATA
  ========================================= */

  businessSubCategories: any[] = [];

  /* =========================================
     FILTERED DATA
  ========================================= */

  filteredSubCategories: any[] = [];

  /* =========================================
     TOTAL PAGES
  ========================================= */

  get totalPages(): number {
    return Math.ceil(this.filteredSubCategories.length / this.itemsPerPage);
  }

  /* =========================================
     NEXT PAGE
  ========================================= */

  nextPage(): void {
    if (this.hasNextPage) {
      this.loadBusinessSubCategories(
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
      this.loadBusinessSubCategories(
        this.currentPage - 1,
        this.itemsPerPage,
        this.searchTerm
      );
    }
  }

  /* =========================================
     LOAD CATEGORIES (for dropdown)
  ========================================= */

  loadCategories(): void {
    this.subCategoryService
      .getCategoriesList()
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.categories = response.data.items.map((item: any) => ({
              businessCategoryId: item.businessCategoryId,
              categoryName: item.categoryName
            }));
          }
        },
        error: (err: any) => {
          console.error(err);
        }
      });
  }

  /* =========================================
     LOAD BUSINESS SUB CATEGORIES
  ========================================= */

  loadBusinessSubCategories(
    pageNumber: number = this.currentPage,
    pageSize: number = this.itemsPerPage,
    search: string = this.searchTerm,
    isActive: boolean | null = null,
    businessCategoryId: number | null = null
  ): void {
    this.subCategoryService
      .getBusinessSubCategoriesList(
        pageNumber,
        pageSize,
        search,
        isActive,
        businessCategoryId
      )
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.businessSubCategories =
              response.data.items.map((item: any) => ({
                businessSubCategoryID: item.businessSubCategoryId,
                businessCategoryID: item.businessCategoryId,
                categoryName: item.categoryName,
                subCategoryName: item.subCategoryName,
                subCategoryCode: item.subCategoryCode,
                description: item.description,
                isActive: item.isActive,
                createdDate: item.createdDate,
                updatedDate: item.updatedDate
              }));
            this.filteredSubCategories = [...this.businessSubCategories];
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
            'Failed to load Business Sub Categories.',
            'Error'
          );
        }
      });
  }

  /* =========================================
     GET CATEGORY NAME BY ID
  ========================================= */

  getCategoryNameById(id: number): string {
    const cat = this.categories.find(c => c.businessCategoryId === id);
    return cat ? cat.categoryName : 'N/A';
  }

  /* =========================================
     FILTER SUB CATEGORIES
  ========================================= */

  filterSubCategories(): void {
    this.currentPage = 1;
    this.loadBusinessSubCategories(
      this.currentPage,
      this.itemsPerPage,
      this.searchTerm
    );
  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(subCategory: any): void {
    this.subCategoryService
      .getBusinessSubCategoryById(subCategory.businessSubCategoryID)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.selectedSubCategory = {
              businessSubCategoryID: response.data.businessSubCategoryId,
              businessCategoryID: response.data.businessCategoryId,
              categoryName: response.data.categoryName,
              subCategoryName: response.data.subCategoryName,
              subCategoryCode: response.data.subCategoryCode,
              description: response.data.description,
              isActive: response.data.isActive,
              createdDate: response.data.createdDate,
              updatedDate: response.data.updatedDate
            };
            this.showViewModal = true;
            document.body.style.overflow = 'hidden';
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (err: any) => {
          console.error(err);
          const message = err?.error?.message || 'Something went wrong.';
          this.toastr.error(message, 'Error');
        }
      });
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
    this.cdr.detectChanges();
  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {
    this.newSubCategory = {
      businessCategoryId: 0,
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
      this.newSubCategory.businessCategoryId === 0 ||
      !this.newSubCategory.subCategoryName.trim() ||
      !this.newSubCategory.subCategoryCode.trim()
    ) {
      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );
      return;
    }

    const request: AddBusinessSubCategoryRequest = {
      businessCategoryId: this.newSubCategory.businessCategoryId,
      subCategoryName: this.newSubCategory.subCategoryName,
      subCategoryCode: this.newSubCategory.subCategoryCode.toUpperCase(),
      description: this.newSubCategory.description,
      isActive: this.newSubCategory.isActive
    };

    this.subCategoryService
      .addBusinessSubCategory(request)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success(response.message, 'Success');
            this.resetForm();
            this.closeAddModal();
            this.loadBusinessSubCategories();
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (error: any) => {
          console.error(error);
          const message = error?.error?.message || 'Something went wrong.';
          this.toastr.error(message, 'Error');
        }
      });
  }

  /* =========================================
     APPROVE
  ========================================= */

  approveSubCategory(): void {
    if (!this.selectedSubCategory) {
      return;
    }

    const payload = {
      businessSubCategoryId: this.selectedSubCategory.businessSubCategoryID,
      businessCategoryId: this.selectedSubCategory.businessCategoryID,
      subCategoryName: this.selectedSubCategory.subCategoryName,
      subCategoryCode: this.selectedSubCategory.subCategoryCode,
      description: this.selectedSubCategory.description,
      isActive: true
    };

    this.subCategoryService
      .updateBusinessSubCategory(payload)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success(response.message, 'Success');
            this.closeViewModal();
            this.loadBusinessSubCategories();
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (err: any) => {
          const message = err?.error?.message || 'Something went wrong.';
          this.toastr.error(message, 'Error');
        }
      });
  }

  /* =========================================
     REJECT
  ========================================= */

  rejectSubCategory(): void {
    if (!this.selectedSubCategory) {
      return;
    }

    const payload = {
      businessSubCategoryId: this.selectedSubCategory.businessSubCategoryID,
      businessCategoryId: this.selectedSubCategory.businessCategoryID,
      subCategoryName: this.selectedSubCategory.subCategoryName,
      subCategoryCode: this.selectedSubCategory.subCategoryCode,
      description: this.selectedSubCategory.description,
      isActive: false
    };

    this.subCategoryService
      .updateBusinessSubCategory(payload)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success(response.message, 'Success');
            this.closeViewModal();
            this.loadBusinessSubCategories();
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (err: any) => {
          const message = err?.error?.message || 'Something went wrong.';
          this.toastr.error(message, 'Error');
        }
      });
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
          subCategory.isActive ? 'Active' : 'Inactive',
          subCategory.createdDate,
          subCategory.updatedDate
        ]
      );

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'business-sub-categories.csv');
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
    this.editSubCategory = { ...subCategory };
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
     UPDATE SUB CATEGORY
  ========================================= */

  updateSubCategory(): void {
    if (
      !this.editSubCategory.subCategoryName.trim() ||
      !this.editSubCategory.subCategoryCode.trim() ||
      !this.editSubCategory.description.trim()
    ) {
      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );
      return;
    }

    const payload = {
      businessSubCategoryId: this.editSubCategory.businessSubCategoryID,
      businessCategoryId: this.editSubCategory.businessCategoryID,
      subCategoryName: this.editSubCategory.subCategoryName,
      subCategoryCode: this.editSubCategory.subCategoryCode.toUpperCase(),
      description: this.editSubCategory.description,
      isActive: this.editSubCategory.isActive
    };

    this.subCategoryService
      .updateBusinessSubCategory(payload)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toastr.success(response.message, 'Success');
            this.closeEditModal();
            this.loadBusinessSubCategories();
          } else {
            this.toastr.error(response.message, 'Error');
          }
        },
        error: (err: any) => {
          const message = err?.error?.message || 'Something went wrong.';
          this.toastr.error(message, 'Error');
        }
      });
  }

}

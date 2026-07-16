import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HorizontalTableScrollDirective } from '../../../shared/directives/horizontal-table-scroll.directive';
import {
  MerchantsService,
  AddMerchantRequest
} from '../../services/merchants.service';

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HorizontalTableScrollDirective
  ],
  templateUrl: './merchants.html',
  styleUrl: './merchants.scss',
})
export class Merchants implements OnInit {

  private merchantsService = inject(MerchantsService);
  private toastr = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  /* =========================================
     SEARCH
  ========================================= */

  searchText: string = '';

  /* =========================================
     MODALS
  ========================================= */

  isAddModalOpen: boolean = false;

  isViewModalOpen: boolean = false;

  /* =========================================
     PAGINATION
  ========================================= */

  currentPage: number = 1;

  itemsPerPage: number = 5;

  totalCount: number = 0;

  totalPages: number = 0;

  hasPreviousPage: boolean = false;

  hasNextPage: boolean = false;

  /* =========================================
     SELECTED MERCHANT
  ========================================= */

  selectedMerchant: any = null;

  /* =========================================
     NEW MERCHANT
  ========================================= */

  newMerchant: any = {

    userId: '',

    businessName: '',

    businessEntityTypeId: '',

    businessCategoryId: '',

    businessSubCategoryId: '',

    expectedSalesPerMonth: '',

    hasGstin: true,

    gstin: '',

    ckycconsentGiven: true,

    ckycidentifier: '',

  };

  /* =========================================
     MERCHANTS DATA
  ========================================= */

  merchants: any[] = [];

  paginatedMerchants: any[] = [];

  /* =========================================
     INIT
  ========================================= */

  ngOnInit(): void {

    this.loadMerchants();

  }

  /* =========================================
     LOAD MERCHANTS
  ========================================= */

  loadMerchants(
    pageNumber: number = this.currentPage,
    pageSize: number = this.itemsPerPage,
    search: string = this.searchText
  ): void {

    this.merchantsService
      .getMerchantList(
        pageNumber,
        pageSize,
        search
      )
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.merchants =
              response.data.items.map((item: any) => ({

                mid: item.mid,

                userId: item.userId,

                businessName: item.businessName,

                businessEntityTypeId: item.businessEntityTypeId,

                onboardingStatusId: item.onboardingStatusId,

                ckycidentifier: item.ckycidentifier,

                expectedSalesPerMonth: item.expectedSalesPerMonth,

                gstin: item.gstin,

                isActive: item.isActive,

                createdDate: item.createdDate,

                updatedDate: item.updatedDate

              }));

            this.paginatedMerchants = [
              ...this.merchants
            ];

            this.currentPage = response.data.pageNumber;
            this.itemsPerPage = response.data.pageSize;
            this.totalCount = response.data.totalCount;
            this.totalPages = response.data.totalPages;
            this.hasPreviousPage = response.data.hasPreviousPage;
            this.hasNextPage = response.data.hasNextPage;

          }

        },

        error: (err: any) => {

          console.error(err);

          this.toastr.error(
            'Failed to load Merchants.',
            'Error'
          );

        }

      });

  }

  /* =========================================
     FILTER MERCHANTS
  ========================================= */

  filterMerchants(): void {

    this.currentPage = 1;

    this.loadMerchants(
      this.currentPage,
      this.itemsPerPage,
      this.searchText
    );

  }

  /* =========================================
     NEXT PAGE
  ========================================= */

  nextPage(): void {

    if (this.hasNextPage) {

      this.loadMerchants(
        this.currentPage + 1,
        this.itemsPerPage,
        this.searchText
      );

    }

  }

  /* =========================================
     PREVIOUS PAGE
  ========================================= */

  previousPage(): void {

    if (this.hasPreviousPage) {

      this.loadMerchants(
        this.currentPage - 1,
        this.itemsPerPage,
        this.searchText
      );

    }

  }

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  openAddModal(): void {

    this.isAddModalOpen = true;

    document.body.style.overflow = 'hidden';

  }

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  closeAddModal(): void {

    this.isAddModalOpen = false;

    document.body.style.overflow = 'auto';

    this.resetForm();

    this.cdr.detectChanges();

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(merchant: any): void {

    this.merchantsService
      .getMerchantById(merchant.mid)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.selectedMerchant = response.data;

            this.isViewModalOpen = true;

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

    this.isViewModalOpen = false;

    this.selectedMerchant = null;

    document.body.style.overflow = 'auto';

    this.cdr.detectChanges();

  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {

    this.newMerchant = {

      userId: '',

      businessName: '',

      businessEntityTypeId: '',

      businessCategoryId: '',

      businessSubCategoryId: '',

      expectedSalesPerMonth: '',

      hasGstin: true,

      gstin: '',

      ckycconsentGiven: true,

      ckycidentifier: '',

    };

  }

  /* =========================================
     ADD MERCHANT
  ========================================= */

  addMerchant(): void {

    if (
      !this.newMerchant.userId
      ||
      !this.newMerchant.businessName
      ||
      !this.newMerchant.businessEntityTypeId
      ||
      !this.newMerchant.expectedSalesPerMonth
      ||
      !this.newMerchant.gstin
    ) {

      this.toastr.warning(
        'Please fill all required fields.',
        'Validation'
      );

      return;

    }

    const request: AddMerchantRequest = {

      userId: Number(this.newMerchant.userId),

      businessName: this.newMerchant.businessName,

      businessEntityTypeId: Number(this.newMerchant.businessEntityTypeId),

      businessCategoryId: this.newMerchant.businessCategoryId
        ? Number(this.newMerchant.businessCategoryId)
        : undefined,

      businessSubCategoryId: this.newMerchant.businessSubCategoryId
        ? Number(this.newMerchant.businessSubCategoryId)
        : undefined,

      expectedSalesPerMonth: Number(this.newMerchant.expectedSalesPerMonth),

      hasGstin: this.newMerchant.hasGstin,

      gstin: this.newMerchant.gstin,

      ckycconsentGiven: this.newMerchant.ckycconsentGiven,

      ckycidentifier: this.newMerchant.ckycidentifier

    };

    this.merchantsService
      .addMerchant(request)
      .subscribe({

        next: (response: any) => {

          if (response.success) {

            this.toastr.success(
              response.message,
              'Success'
            );

            this.resetForm();
            this.closeAddModal();
            this.loadMerchants();

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
     APPROVE MERCHANT
  ========================================= */

  approveMerchant(): void {

    if (!this.selectedMerchant) {
      return;
    }

    this.loadMerchants();

    this.closeViewModal();

  }

  /* =========================================
     REJECT MERCHANT
  ========================================= */

  rejectMerchant(): void {

    if (!this.selectedMerchant) {
      return;
    }

    this.loadMerchants();

    this.closeViewModal();

  }

  /* =========================================
     EXPORT CSV
  ========================================= */

  exportCSV(): void {

    const headers = [

      'MID',

      'User ID',

      'Business Name',

      'Entity Type',

      'Onboarding Status',

      'CKYC ID',

      'Expected Sales',

      'GSTIN',

      'Status',

      'Created Date',

      'Updated Date'

    ];

    const rows =
      this.merchants.map(
        (merchant: any) => [

          merchant.mid,

          merchant.userId,

          merchant.businessName,

          merchant.businessEntityTypeId,

          merchant.onboardingStatusId,

          merchant.ckycidentifier,

          merchant.expectedSalesPerMonth,

          merchant.gstin,

          merchant.isActive
            ? 'Active'
            : 'Inactive',

          merchant.createdDate,

          merchant.updatedDate

        ]
      );

    const csvContent = [

      headers.join(','),

      ...rows.map((row: any) =>
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
      'merchants.csv'
    );

    link.style.visibility = 'hidden';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }

}

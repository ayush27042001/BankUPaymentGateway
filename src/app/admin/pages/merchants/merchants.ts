import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-merchants',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './merchants.html',
  styleUrl: './merchants.scss',
})
export class Merchants {

  /* =========================================
     SEARCH
  ========================================= */

  searchText: string = '';

  /* =========================================
     MODALS
  ========================================= */

  isAddModalOpen: boolean = false;

  isViewModalOpen: boolean = false;

  isSaving: boolean = false;

  /* =========================================
     PAGINATION
  ========================================= */

  currentPage: number = 1;

  itemsPerPage: number = 5;

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

    businessEntityTypeID: '',

    onboardingStatusID: '',

    ckycIdentifier: '',

    expectedSalesPerMonth: '',

    gstin: '',

  };

  /* =========================================
     MERCHANTS DATA
  ========================================= */

  merchants = [

    {
      mid: 'MID001',
      userId: 1,
      businessName: 'Test Business',
      businessEntityTypeID: 2,
      onboardingStatusID: 7,
      ckycIdentifier: 'CKYC001',
      expectedSalesPerMonth: 100000,
      gstin: '06AAXCA4000A1Z5',
      isActive: true,
      createdDate: '11 May 2026',
      updatedDate: '11 May 2026',
    },

    {
      mid: 'MID002',
      userId: 2,
      businessName: 'Fashion Hub',
      businessEntityTypeID: 1,
      onboardingStatusID: 5,
      ckycIdentifier: 'CKYC002',
      expectedSalesPerMonth: 250000,
      gstin: '07BBBCD1234B1Z7',
      isActive: true,
      createdDate: '12 May 2026',
      updatedDate: '12 May 2026',
    },

    {
      mid: 'MID003',
      userId: 3,
      businessName: 'Electro World',
      businessEntityTypeID: 3,
      onboardingStatusID: 4,
      ckycIdentifier: 'CKYC003',
      expectedSalesPerMonth: 500000,
      gstin: '08CCDDE5678C1Z2',
      isActive: false,
      createdDate: '13 May 2026',
      updatedDate: '13 May 2026',
    },

    {
      mid: 'MID004',
      userId: 4,
      businessName: 'Food Express',
      businessEntityTypeID: 4,
      onboardingStatusID: 6,
      ckycIdentifier: 'CKYC004',
      expectedSalesPerMonth: 750000,
      gstin: '09EEFFF9012D1Z8',
      isActive: true,
      createdDate: '14 May 2026',
      updatedDate: '14 May 2026',
    },

    {
      mid: 'MID005',
      userId: 5,
      businessName: 'Wellness Point',
      businessEntityTypeID: 5,
      onboardingStatusID: 3,
      ckycIdentifier: 'CKYC005',
      expectedSalesPerMonth: 150000,
      gstin: '10GGHHH3456E1Z4',
      isActive: false,
      createdDate: '15 May 2026',
      updatedDate: '15 May 2026',
    },

  ];

  /* =========================================
     FILTERED MERCHANTS
  ========================================= */

  filteredMerchants() {

    const search =
      this.searchText
        .toLowerCase()
        .trim();

    if (!search) {
      return this.merchants;
    }

    return this.merchants.filter(
      (merchant: any) => {

        return (

          merchant.mid
            ?.toLowerCase()
            .includes(search)

          ||

          merchant.userId
            ?.toString()
            .includes(search)

          ||

          merchant.businessName
            ?.toLowerCase()
            .includes(search)

          ||

          merchant.gstin
            ?.toLowerCase()
            .includes(search)

        );

      }
    );

  }

  /* =========================================
     PAGINATED DATA
  ========================================= */

  paginatedMerchants() {

    const startIndex =
      (this.currentPage - 1)
      * this.itemsPerPage;

    const endIndex =
      startIndex + this.itemsPerPage;

    return this.filteredMerchants().slice(
      startIndex,
      endIndex
    );

  }

  /* =========================================
     TOTAL PAGES
  ========================================= */

  get totalPages(): number {

    return Math.ceil(
      this.filteredMerchants().length
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
     OPEN ADD MODAL
  ========================================= */

  openAddModal(): void {

    this.isAddModalOpen = true;

    document.body.style.overflow =
      'hidden';

  }

  /* =========================================
     CLOSE ADD MODAL
  ========================================= */

  closeAddModal(): void {

    this.isAddModalOpen = false;

    document.body.style.overflow =
      'auto';

    this.resetForm();

  }

  /* =========================================
     OPEN VIEW MODAL
  ========================================= */

  openViewModal(
    merchant: any
  ): void {

    this.selectedMerchant =
      merchant;

    this.isViewModalOpen = true;

    document.body.style.overflow =
      'hidden';

  }

  /* =========================================
     CLOSE VIEW MODAL
  ========================================= */

  closeViewModal(): void {

    this.isViewModalOpen = false;

    this.selectedMerchant = null;

    document.body.style.overflow =
      'auto';

  }

  /* =========================================
     RESET FORM
  ========================================= */

  resetForm(): void {

    this.newMerchant = {

      userId: '',

      businessName: '',

      businessEntityTypeID: '',

      onboardingStatusID: '',

      ckycIdentifier: '',

      expectedSalesPerMonth: '',

      gstin: '',

    };

  }

  /* =========================================
     ADD MERCHANT
  ========================================= */
/* =========================================
   APPROVE MERCHANT
========================================= */

approveMerchant(): void {

  if (!this.selectedMerchant) {
    return;
  }

  this.selectedMerchant.isActive = true;

  this.selectedMerchant.updatedDate =
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
   REJECT MERCHANT
========================================= */

rejectMerchant(): void {

  if (!this.selectedMerchant) {
    return;
  }

  this.selectedMerchant.isActive = false;

  this.selectedMerchant.updatedDate =
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
    this.filteredMerchants().map(
      (merchant: any) => [

        merchant.mid,

        merchant.userId,

        merchant.businessName,

        merchant.businessEntityTypeID,

        merchant.onboardingStatusID,

        merchant.ckycIdentifier,

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
  addMerchant(): void {

    if (

      !this.newMerchant.userId
      ||

      !this.newMerchant.businessName
      ||

      !this.newMerchant.businessEntityTypeID
      ||

      !this.newMerchant.gstin

    ) {

      alert(
        'Please fill all required fields.'
      );

      return;

    }

    this.isSaving = true;

    setTimeout(() => {

      const currentDate =
        new Date().toLocaleDateString(
          'en-GB',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }
        );

      const merchant = {

        mid:
          'MID00'
          + (this.merchants.length + 1),

        userId:
          this.newMerchant.userId,

        businessName:
          this.newMerchant.businessName,

        businessEntityTypeID:
          this.newMerchant.businessEntityTypeID,

        onboardingStatusID:
          this.newMerchant.onboardingStatusID,

        ckycIdentifier:
          this.newMerchant.ckycIdentifier,

        expectedSalesPerMonth:
          this.newMerchant.expectedSalesPerMonth,

        gstin:
          this.newMerchant.gstin,

        isActive: true,

        createdDate:
          currentDate,

        updatedDate:
          currentDate,

      };

      this.merchants.unshift(
        merchant
      );

      this.isSaving = false;

      this.closeAddModal();

      this.currentPage = 1;

    }, 1000);

  }

}
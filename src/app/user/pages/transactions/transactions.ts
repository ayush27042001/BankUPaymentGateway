import {
  Component,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';

type TransactionTab =
  | 'payments'
  | 'refunds'
  | 'batchRefunds';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss'
})
export class Transactions {

  activeTab: TransactionTab = 'payments';

  /* =========================================
     SEARCH DROPDOWN
  ========================================= */

  showSearchDropdown = false;

  selectedSearchField =
    'PayU ID (Transaction ID)';

  searchOptions = [
    'PayU ID (Transaction ID)',
    'Customer Email',
    'Merchant Reference ID',
    'Phone Number',
    'Customer Name',
    'UPI / Bank Reference'
  ];

  /* =========================================
     DATE DROPDOWN
  ========================================= */

  showDateDropdown = false;

  selectedDate =
    'Last 1 Hour';

  dateOptions = [
    'Today',
    'Yesterday',
    'Last 1 Hour',
    'Last 7 Days',
    'Last 30 Days',
    'Custom Range'
  ];

  /* =========================================
     DOWNLOAD DROPDOWN
  ========================================= */

  showDownloadDropdown = false;

  selectedDownload = '';

  downloadOptions = [
    'CSV',
    'XLSX',
    'Select Fields'
  ];

  /* =========================================
     FILTER PANEL
  ========================================= */

  showFilterPanel = false;

  sourceFilters = [
    'Payment Gateway',
    'Buttons',
    'Payment Links',
    'SI-Transaction',
    'SI-Registration',
    'Payment Handle',
    'Invoice',
    'Events',
    'Web Stores',
    'POS',
    'StoreFront QR'
  ];

  transactionStatus = [
    'Success',
    'In Progress',
    'User Cancelled',
    'Failed',
    'Auto Refund',
    'User Dropped',
    'Bounced',
    'Refund Success',
    'Refund Failed',
    'Refund Pending',
    'Cancelled',
    'Authorized'
  ];

  /* =========================================
     TABS
  ========================================= */

  setTab(tab: TransactionTab): void {

    this.activeTab = tab;

    this.closeAllDropdowns();
  }

  /* =========================================
     SEARCH DROPDOWN
  ========================================= */

  toggleSearchDropdown(
    event: Event
  ): void {

    event.stopPropagation();

    this.showSearchDropdown =
      !this.showSearchDropdown;

    this.showDateDropdown = false;
    this.showDownloadDropdown = false;
  }

  selectSearchField(
    field: string
  ): void {

    this.selectedSearchField = field;

    this.showSearchDropdown = false;
  }

  /* =========================================
     DATE DROPDOWN
  ========================================= */

  toggleDateDropdown(
    event: Event
  ): void {

    event.stopPropagation();

    this.showDateDropdown =
      !this.showDateDropdown;

    this.showSearchDropdown = false;
    this.showDownloadDropdown = false;
  }

  selectDate(
    date: string
  ): void {

    this.selectedDate = date;

    this.showDateDropdown = false;
  }

  /* =========================================
     DOWNLOAD DROPDOWN
  ========================================= */

  toggleDownloadDropdown(
    event: Event
  ): void {

    event.stopPropagation();

    this.showDownloadDropdown =
      !this.showDownloadDropdown;

    this.showSearchDropdown = false;
    this.showDateDropdown = false;
  }

  selectDownload(
    option: string
  ): void {

    this.selectedDownload = option;

    this.showDownloadDropdown = false;

    console.log(
      'Download:',
      option
    );
  }

  /* =========================================
     FILTER PANEL
  ========================================= */

  toggleFilterPanel(): void {

    this.showFilterPanel =
      !this.showFilterPanel;
  }

  clearFilters(): void {

    console.log(
      'Filters Reset'
    );
  }

  applyFilters(): void {

    console.log(
      'Filters Applied'
    );

    this.showFilterPanel = false;
  }

  /* =========================================
     ACTIONS
  ========================================= */

  viewAnalytics(): void {

    console.log(
      'View Analytics Clicked'
    );
  }

  searchTransactions(): void {

    console.log(
      'Search Clicked'
    );
  }

  downloadReport(): void {

    console.log(
      'Download Clicked'
    );
  }

  uploadBatchRefund(): void {

    console.log(
      'Upload Batch Refund Clicked'
    );
  }

  /* =========================================
     CLOSE DROPDOWNS
  ========================================= */

  @HostListener('document:click')
  closeAllDropdowns(): void {

    this.showSearchDropdown = false;

    this.showDateDropdown = false;

    this.showDownloadDropdown = false;
  }
}
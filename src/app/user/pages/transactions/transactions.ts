import {
  Component,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type TransactionTab =
  | 'payments'
  | 'refunds'
  | 'batchRefunds';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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
     SEARCH / FILTER STATE
  ========================================= */

  searchQuery = '';

  selectedSources: string[] = [];

  selectedStatuses: string[] = [];

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

toggleSearchDropdown(event: Event): void {

  event.stopPropagation();

  this.showSearchDropdown = !this.showSearchDropdown;
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

    this.searchQuery = '';

    this.selectedSources = [];

    this.selectedStatuses = [];

    this.selectedSearchField = 'PayU ID (Transaction ID)';

    this.selectedDate = 'Last 1 Hour';

    console.log(
      'Filters Reset'
    );
  }

  applyFilters(): void {

    console.log(
      'Filters Applied',
      {
        sources: this.selectedSources,
        statuses: this.selectedStatuses,
        date: this.selectedDate,
        searchField: this.selectedSearchField,
        query: this.searchQuery
      }
    );

    this.showFilterPanel = false;
  }

  /* =========================================
     SOURCE / STATUS TOGGLE
  ========================================= */

  toggleSourceFilter(source: string): void {

    const idx = this.selectedSources.indexOf(source);

    if (idx > -1) {
      this.selectedSources.splice(idx, 1);
    } else {
      this.selectedSources.push(source);
    }
  }

  toggleStatusFilter(status: string): void {

    const idx = this.selectedStatuses.indexOf(status);

    if (idx > -1) {
      this.selectedStatuses.splice(idx, 1);
    } else {
      this.selectedStatuses.push(status);
    }
  }

  isSourceSelected(source: string): boolean {

    return this.selectedSources.indexOf(source) > -1;
  }

  isStatusSelected(status: string): boolean {

    return this.selectedStatuses.indexOf(status) > -1;
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
      'Search:',
      this.searchQuery
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
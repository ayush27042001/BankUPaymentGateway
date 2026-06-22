import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settlements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settlements.html',
  styleUrl: './settlements.scss'
})
export class Settlements {

  searchValue: string = '';

  dateRange: string = "4 Jun'26 - 10 Jun'26";

  // =========================================
  // DROPDOWNS
  // =========================================

  isDateDropdownOpen = false;

  isFilterDropdownOpen = false;

  isDownloadDropdownOpen = false;

  // =========================================
  // FILTERS
  // =========================================

  selectedStatuses: string[] = [];

  selectedCycles: string[] = [];

  // =========================================
  // DATE OPTIONS
  // =========================================

  dateOptions = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    'Last 30 Days',
    'Custom Range'
  ];

  showCustomDatePicker = false;

  customFromDate = '';

  customToDate = '';

  // =========================================
  // STATUS OPTIONS
  // =========================================

  statusOptions = [
    'Settled',
    'Processing',
    'In Progress',
    'On Hold'
  ];

  // =========================================
  // CYCLE OPTIONS
  // =========================================

  cycleOptions = [
    'Priority Settlement',
    'Regular Settlement'
  ];

  // =========================================
  // DOWNLOAD OPTIONS
  // =========================================

  downloadOptions = [
    'Settlement (csv)',
    'Settlement (xlsx)',
    'Settlement Transactions (csv)',
    'Settlement Transactions (xlsx)'
  ];

  // =========================================
  // DATE DROPDOWN
  // =========================================

  toggleDateDropdown(): void {

    this.isDateDropdownOpen =
      !this.isDateDropdownOpen;

    this.isFilterDropdownOpen = false;
    this.isDownloadDropdownOpen = false;

  }

  selectDateRange(
    value: string
  ): void {

    this.dateRange = value;

    if (value === 'Custom Range') {

      this.showCustomDatePicker = true;

      this.isDateDropdownOpen = false;

      return;
    }

    this.showCustomDatePicker = false;

    this.isDateDropdownOpen = false;

  }

  // =========================================
  // FILTER DROPDOWN
  // =========================================

  toggleFilterDropdown(): void {

    this.isFilterDropdownOpen =
      !this.isFilterDropdownOpen;

    this.isDateDropdownOpen = false;
    this.isDownloadDropdownOpen = false;

  }

  // =========================================
  // DOWNLOAD DROPDOWN
  // =========================================

  toggleDownloadDropdown(): void {

    this.isDownloadDropdownOpen =
      !this.isDownloadDropdownOpen;

    this.isDateDropdownOpen = false;
    this.isFilterDropdownOpen = false;

  }

  // =========================================
  // STATUS CHECKBOX
  // =========================================

  toggleStatus(
    status: string
  ): void {

    const index =
      this.selectedStatuses.indexOf(status);

    if (index > -1) {

      this.selectedStatuses.splice(
        index,
        1
      );

    } else {

      this.selectedStatuses.push(
        status
      );

    }

  }

  // =========================================
  // CYCLE CHECKBOX
  // =========================================

  toggleCycle(
    cycle: string
  ): void {

    const index =
      this.selectedCycles.indexOf(cycle);

    if (index > -1) {

      this.selectedCycles.splice(
        index,
        1
      );

    } else {

      this.selectedCycles.push(
        cycle
      );

    }

  }

  // =========================================
  // FILTER ACTIONS
  // =========================================

  applyFilters(): void {

    console.log(
      'Applied Filters',
      {
        statuses: this.selectedStatuses,
        cycles: this.selectedCycles
      }
    );

    this.isFilterDropdownOpen = false;

  }

  clearFilters(): void {

    this.selectedStatuses = [];

    this.selectedCycles = [];

    this.isFilterDropdownOpen = false;

    this.showCustomDatePicker = false;

    this.customFromDate = '';

    this.customToDate = '';

  }

  // =========================================
  // CUSTOM DATE RANGE
  // =========================================

  applyCustomDateRange(): void {

    if (this.customFromDate && this.customToDate) {

      this.dateRange =
        `${this.customFromDate} - ${this.customToDate}`;
    }

    this.showCustomDatePicker = false;

    this.isDateDropdownOpen = false;

    console.log(
      'Date Range Applied',
      this.customFromDate,
      this.customToDate
    );
  }

  closeCustomDateRange(): void {

    this.customFromDate = '';

    this.customToDate = '';

    this.showCustomDatePicker = false;
  }

  // =========================================
  // SEARCH
  // =========================================

  searchSettlement(): void {

    console.log(
      'Search Settlement:',
      this.searchValue
    );

  }

  // =========================================
  // DOWNLOAD
  // =========================================

  downloadSettlement(
    type?: string
  ): void {

    console.log(
      'Download Settlement:',
      type
    );

    this.isDownloadDropdownOpen = false;

  }

  // =========================================
  // INVOICE
  // =========================================

  downloadMonthlyInvoice(): void {

    console.log(
      'Download Monthly Invoice'
    );

  }

  // =========================================
  // MANAGE CYCLE
  // =========================================

  manageCycle(): void {

    console.log(
      'Manage Settlement Cycle'
    );

  }

}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-chargeback',
  standalone: true,

  imports: [
  CommonModule,
  FormsModule
],

  templateUrl: './chargeback.html',
  styleUrl: './chargeback.scss',
})
export class Chargeback {

  // =========================================
  // ACCORDION
  // =========================================

  isAnalysisOpen = true;

  // =========================================
  // FORM FIELDS
  // =========================================

  payuId = '';

  transactionId = '';

  bankCase = '';

  chargebackStatus = '';

  chargebackType = '';

  closeReason = '';

  fromDate = '';

  toDate = '';

  // =========================================
  // DROPDOWN DATA
  // =========================================

  statusOptions = [
    'New',
    'Pending Response',
    'Pending Review',
    'Closed'
  ];

  chargebackTypes = [
    'CB',
    'Good Faith',
    'Pre Arb'
  ];

  closeReasons = [
    'Accepted',
    'Rejected',
    'Resolved'
  ];

  // =========================================
  // ACCORDION
  // =========================================

  toggleAnalysis(): void {

    this.isAnalysisOpen =
      !this.isAnalysisOpen;

  }

  // =========================================
  // ACTIONS
  // =========================================

  searchChargebacks(): void {

    console.log(
      'Search Chargebacks'
    );

  }

  resetFilters(): void {

    this.payuId = '';
    this.transactionId = '';
    this.bankCase = '';
    this.chargebackStatus = '';
    this.chargebackType = '';
    this.closeReason = '';
    this.fromDate = '';
    this.toDate = '';

    console.log(
      'Filters Reset'
    );

  }

  exportChargebacks(): void {

    console.log(
      'Export Chargebacks'
    );

  }

  bulkUpload(): void {

    console.log(
      'Bulk Upload'
    );

  }

  configureWebhooks(): void {

    console.log(
      'Configure Webhooks'
    );

  }

  toggleAnnouncement(): void {

    console.log(
      'Show / Hide Notice'
    );

  }

}
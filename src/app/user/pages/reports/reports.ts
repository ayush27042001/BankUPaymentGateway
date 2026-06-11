import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chargeback',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class Reports {

  activeTab: string = 'category';

  // =========================================
  // PAYMENT REPORTS
  // =========================================

  paymentReports = [
    {
      title: 'Transaction',
      icon: 'bi-arrow-down-up',
      description:
        'Fetch the transaction data like payment, customer info, status.'
    },
    {
      title: 'Settlement',
      icon: 'bi-bank',
      description:
        'Fetch the settlement details with statuses, service fee and consolidated data.'
    },
    {
      title: 'Refunds',
      icon: 'bi-arrow-counterclockwise',
      description:
        'Fetch the details of refunds that were initiated and their statuses.'
    }
  ];

  // =========================================
  // PRODUCT REPORTS
  // =========================================

  productReports = [
    {
      title: 'Payouts',
      icon: 'bi-wallet2',
      description:
        'Fetch payouts data like amount disbursed, beneficiary and statuses.'
    },
    {
      title: 'Buttons',
      icon: 'bi-hand-index-thumb',
      description:
        'Fetch transactional data like amount collected and status of payment buttons.'
    },
    {
      title: 'Payment Links',
      icon: 'bi-link-45deg',
      description:
        'Fetch transactional data like amount collected and status of payment links.'
    },
    {
      title: 'Old Payment Link Data',
      icon: 'bi-link',
      description:
        'Fetch transactional data like amount collected and status of old payment links.'
    },
    {
      title: 'Payment Invoices',
      icon: 'bi-file-earmark-text',
      description:
        'Fetch transactional data like amount collected and status of payment invoices.'
    },
    {
      title: 'Refund Wallet',
      icon: 'bi-wallet',
      description:
        'Fetch refund processed, balance and topup information.'
    },
    {
      title: 'Wallets',
      icon: 'bi-credit-card',
      description:
        'Fetch load and unload transaction information.'
    },
    {
      title: 'Loyalty',
      icon: 'bi-award',
      description:
        'Fetch loyalty based transactions such as points earned and burned.'
    }
  ];

  // =========================================
  // FINANCIAL REPORTS
  // =========================================

  financialReports = [
    {
      title: 'TDR Report',
      description:
        'These are monthly invoices from PayU for service fees and tax.',
      action: 'Download Report',
      isNew: false
    },
    {
      title: 'Billing and Charges',
      description:
        'Check all invoices raised by PayU and download charge reports.',
      action: 'View Report',
      isNew: true
    }
  ];

  // =========================================
  // TAB CHANGE
  // =========================================

  setTab(
    tab: string
  ): void {

    this.activeTab = tab;

  }

  // =========================================
  // DOWNLOAD REPORT
  // =========================================

  downloadReport(
    reportName: string
  ): void {

    console.log(
      'Download Report:',
      reportName
    );

  }

  // =========================================
  // HEADER BUTTONS
  // =========================================

  download(): void {

    this.activeTab = 'downloads';

  }

  schedule(): void {

    this.activeTab = 'scheduled';

  }

}
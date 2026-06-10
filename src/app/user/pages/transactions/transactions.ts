import { Component } from '@angular/core';
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

  setTab(tab: TransactionTab): void {
    this.activeTab = tab;
  }

  viewAnalytics(): void {
    console.log('View Analytics Clicked');
  }

  searchTransactions(): void {
    console.log('Search Clicked');
  }

  downloadReport(): void {
    console.log('Download Clicked');
  }

  uploadBatchRefund(): void {
    console.log('Upload Batch Refund Clicked');
  }

}
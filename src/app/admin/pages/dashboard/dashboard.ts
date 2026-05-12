import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  /* =========================================
     FILTERS
  ========================================= */

  selectedService: string = 'All Service';

  selectedStatus: string = 'All';

  fromDate: string = '';

  toDate: string = '';

  /* =========================================
     STATS DATA
  ========================================= */

  statsCards = [

    {
      title: 'Total Users',
      value: '1,248',
      growth: '12.5%',
      isPositive: true,
      icon: 'bi-people',
      gradient: 'purple-gradient'
    },

    {
      title: 'Total Merchants',
      value: '2,453',
      growth: '8.4%',
      isPositive: true,
      icon: 'bi-shop',
      gradient: 'blue-gradient'
    },

    {
      title: 'Active Merchants',
      value: '1,689',
      growth: '9.7%',
      isPositive: true,
      icon: 'bi-shop-window',
      gradient: 'green-gradient'
    },

    {
      title: 'Pending Verifications',
      value: '342',
      growth: '3.2%',
      isPositive: false,
      icon: 'bi-hourglass-split',
      gradient: 'orange-gradient'
    },

    {
      title: 'Total Revenue',
      value: '₹ 24.68 L',
      growth: '15.8%',
      isPositive: true,
      icon: 'bi-wallet2',
      gradient: 'violet-gradient'
    },

    {
      title: 'Total Transactions',
      value: '18,742',
      growth: '11.3%',
      isPositive: true,
      icon: 'bi-credit-card',
      gradient: 'pink-gradient'
    }

  ];

  /* =========================================
     RECENT ACTIVITIES
  ========================================= */

  recentActivities = [

    {
      title: 'New user registered',
      description: 'john.doe@example.com',
      icon: 'bi-person-plus-fill',
      bgClass: 'green-bg',
      time: '2 mins ago'
    },

    {
      title: 'New merchant onboarded',
      description: 'ABC Retail Store',
      icon: 'bi-shop',
      bgClass: 'blue-bg',
      time: '15 mins ago'
    },

    {
      title: 'KYC verification pending',
      description: 'Merchant ID: MRC1234',
      icon: 'bi-hourglass-split',
      bgClass: 'orange-bg',
      time: '1 hour ago'
    },

    {
      title: 'Merchant approved',
      description: 'Merchant ID: MRC5678',
      icon: 'bi-check-lg',
      bgClass: 'pink-bg',
      time: '2 hours ago'
    }

  ];

  /* =========================================
     RECENT TRANSACTIONS
  ========================================= */

  recentTransactions = [

    {
      txnId: 'TXN1256',
      merchant: 'ABC Retail',
      amount: '₹ 12,450',
      status: 'Success',
      statusClass: 'success-badge',
      date: '22 May 2025'
    },

    {
      txnId: 'TXN1255',
      merchant: 'XYZ Electronics',
      amount: '₹ 8,750',
      status: 'Success',
      statusClass: 'success-badge',
      date: '22 May 2025'
    },

    {
      txnId: 'TXN1254',
      merchant: 'Fashion Hub',
      amount: '₹ 5,320',
      status: 'Pending',
      statusClass: 'pending-badge',
      date: '22 May 2025'
    },

    {
      txnId: 'TXN1253',
      merchant: 'Daily Needs',
      amount: '₹ 2,890',
      status: 'Failed',
      statusClass: 'failed-badge',
      date: '21 May 2025'
    }

  ];

  /* =========================================
     QUICK ACTIONS
  ========================================= */

  quickActions = [

    {
      title: 'Add Merchant',
      icon: 'bi-shop'
    },

    {
      title: 'Add User',
      icon: 'bi-person-plus'
    },

    {
      title: 'Generate Report',
      icon: 'bi-file-earmark-bar-graph'
    },

    {
      title: 'Pending KYC',
      icon: 'bi-hourglass-split'
    },

    {
      title: 'Download Transactions',
      icon: 'bi-download'
    }

  ];

  /* =========================================
     FILTER ACTIONS
  ========================================= */

  searchDashboard(): void {

    console.log('Search Triggered');

    console.log({
      service: this.selectedService,
      status: this.selectedStatus,
      fromDate: this.fromDate,
      toDate: this.toDate
    });

  }

  resetFilters(): void {

    this.selectedService = 'All Service';

    this.selectedStatus = 'All';

    this.fromDate = '';

    this.toDate = '';

    console.log('Filters Reset');

  }

  exportDashboardData(): void {

    const csvData = [

      [
        'Transaction ID',
        'Merchant',
        'Amount',
        'Status',
        'Date'
      ],

      ...this.recentTransactions.map(
        transaction => [

          transaction.txnId,
          transaction.merchant,
          transaction.amount,
          transaction.status,
          transaction.date

        ]
      )

    ];

    const csvContent = csvData
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob(
      [csvContent],
      {
        type: 'text/csv;charset=utf-8;'
      }
    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.setAttribute(
      'download',
      'dashboard-transactions.csv'
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

  }

  /* =========================================
     VIEW ALL
  ========================================= */

  viewAllActivities(): void {

    console.log(
      'View All Activities'
    );

  }

  viewAllTransactions(): void {

    console.log(
      'View All Transactions'
    );

  }

  /* =========================================
     QUICK ACTION BUTTONS
  ========================================= */

  handleQuickAction(
    action: string
  ): void {

    switch (action) {

      case 'Add Merchant':

        console.log(
          'Navigate to Add Merchant'
        );

        break;

      case 'Add User':

        console.log(
          'Navigate to Add User'
        );

        break;

      case 'Generate Report':

        console.log(
          'Generate Report'
        );

        break;

      case 'Pending KYC':

        console.log(
          'Open Pending KYC'
        );

        break;

      case 'Download Transactions':

        this.exportDashboardData();

        break;

      default:

        console.log(
          'Unknown Action'
        );

        break;

    }

  }

}
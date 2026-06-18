import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-mode.html',
  styleUrl: './payment-mode.scss'
})
export class PaymentMode {

  /* ===========================================
      TOP TAB
  =========================================== */

  activeTab: 'methods' | 'reminders' = 'methods';

  setTab(tab: 'methods' | 'reminders') {
    this.activeTab = tab;
  }

  /* ===========================================
      SIDEBAR
  =========================================== */

  paymentCategories = [

    {
      name: 'Debit Card',
      icon: 'bi bi-credit-card-2-front'
    },

    {
      name: 'Credit Card',
      icon: 'bi bi-credit-card'
    },

    {
      name: 'Net Banking',
      icon: 'bi bi-bank'
    },

    {
      name: 'Wallets',
      icon: 'bi bi-wallet2'
    },

    {
      name: 'EMI',
      icon: 'bi bi-cash-stack'
    },

    {
      name: 'BNPL',
      icon: 'bi bi-clock-history'
    },

    {
      name: 'International',
      icon: 'bi bi-globe'
    }

  ];

  selectedCategory = 'Debit Card';

  selectedDescription = 'Most in-demand payment mode';

  /* ===========================================
      PAYMENT DATA
  =========================================== */

  paymentData: any = {

  'Debit Card': [

    {
      name: 'MasterCard (All Banks)',
      type: 'Debit Card',
      icon: 'bi bi-credit-card-2-front',
      color: '#ea580c'
    },

    {
      name: 'Visa (All Banks)',
      type: 'Debit Card',
      icon: 'bi bi-credit-card',
      color: '#2563eb'
    },

    {
      name: 'RuPay Debit Card',
      type: 'Debit Card',
      icon: 'bi bi-credit-card-fill',
      color: '#16a34a'
    }

  ],

  'Credit Card': [

    {
      name: 'Visa Credit Card',
      type: 'Credit Card',
      icon: 'bi bi-credit-card',
      color: '#2563eb'
    },

    {
      name: 'Master Credit Card',
      type: 'Credit Card',
      icon: 'bi bi-credit-card-2-front',
      color: '#ea580c'
    }

  ],

  'Net Banking': [

    {
      name: 'State Bank of India',
      type: 'Net Banking',
      icon: 'bi bi-bank',
      color: '#0f766e'
    },

    {
      name: 'HDFC Bank',
      type: 'Net Banking',
      icon: 'bi bi-bank2',
      color: '#dc2626'
    },

    {
      name: 'ICICI Bank',
      type: 'Net Banking',
      icon: 'bi bi-bank2',
      color: '#ea580c'
    }

  ],

  'Wallets': [

    {
      name: 'Paytm',
      type: 'Wallet',
      icon: 'bi bi-wallet2',
      color: '#0ea5e9'
    },

    {
      name: 'PhonePe',
      type: 'Wallet',
      icon: 'bi bi-phone',
      color: '#7e22ce'
    },

    {
      name: 'Amazon Pay',
      type: 'Wallet',
      icon: 'bi bi-bag-check',
      color: '#f59e0b'
    }

  ],

  'EMI': [

    {
      name: 'HDFC EMI',
      type: 'EMI',
      icon: 'bi bi-cash-stack',
      color: '#dc2626'
    },

    {
      name: 'ICICI EMI',
      type: 'EMI',
      icon: 'bi bi-cash-coin',
      color: '#ea580c'
    }

  ],

  'BNPL': [

    {
      name: 'LazyPay',
      type: 'BNPL',
      icon: 'bi bi-clock-history',
      color: '#0891b2'
    },

    {
      name: 'Simpl',
      type: 'BNPL',
      icon: 'bi bi-lightning-charge',
      color: '#7c3aed'
    }

  ],

  'International': [

    {
      name: 'American Express',
      type: 'International',
      icon: 'bi bi-globe2',
      color: '#2563eb'
    }

  ]

};

  filteredMethods = this.paymentData['Debit Card'];

  /* ===========================================
      CHANGE CATEGORY
  =========================================== */

  selectCategory(category: string) {

    this.selectedCategory = category;

    this.filteredMethods = this.paymentData[category];

    switch (category) {

      case 'Debit Card':
        this.selectedDescription = 'Most in-demand payment mode';
        break;

      case 'Credit Card':
        this.selectedDescription = 'Supported credit card networks';
        break;

      case 'Net Banking':
        this.selectedDescription = 'Banks available for Net Banking';
        break;

      case 'Wallets':
        this.selectedDescription = 'Popular wallet providers';
        break;

      case 'EMI':
        this.selectedDescription = 'EMI supported banks';
        break;

      case 'BNPL':
        this.selectedDescription = 'Buy Now Pay Later partners';
        break;

      case 'International':
        this.selectedDescription = 'International payment methods';
        break;

      default:
        this.selectedDescription = '';

    }

  }

}
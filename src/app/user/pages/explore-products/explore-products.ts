import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  status: 'active' | 'inactive';
  icon: string;
  primaryAction: string;
  secondaryAction?: string;
}

@Component({
  selector: 'app-explore-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './explore-products.html',
  styleUrl: './explore-products.scss',
})
export class ExploreProducts {

  activeTab: 'all' | 'active' | 'inactive' = 'all';

  searchText = '';

  products: Product[] = [

    // =========================================
    // INTEGRATION
    // =========================================

    {
      id: 1,
      title: 'Payment Gateway',
      description:
        '150+ secure payment modes with analytics & seamless checkout.',
      category: 'Integration',
      status: 'inactive',
      icon: 'bi-globe',
      primaryAction: 'Integration Docs',
      secondaryAction: 'Know More'
    },

    {
      id: 2,
      title: 'Subscription Payments',
      description:
        'Automate recurring billing with smart retries for steady revenue.',
      category: 'Integration',
      status: 'inactive',
      icon: 'bi-calendar-check',
      primaryAction: 'Raise Request',
      secondaryAction: 'Know More'
    },

    // =========================================
    // NO CODE PAYMENT TOOLS
    // =========================================

    {
      id: 3,
      title: 'Payment Links',
      description:
        'Share payment links via SMS, Email and WhatsApp instantly.',
      category: 'No-Code Payment Tools',
      status: 'active',
      icon: 'bi-link-45deg',
      primaryAction: 'Create Link'
    },

    {
      id: 4,
      title: 'Payment Button',
      description:
        'Accept payments directly through website payment buttons.',
      category: 'No-Code Payment Tools',
      status: 'active',
      icon: 'bi-credit-card',
      primaryAction: 'Create Button'
    },

    {
      id: 5,
      title: 'Invoices',
      description:
        'Send GST invoices and automate reminders from dashboard.',
      category: 'No-Code Payment Tools',
      status: 'active',
      icon: 'bi-file-earmark-text',
      primaryAction: 'Create Invoice'
    },

    // =========================================
    // IN PERSON PAYMENT
    // =========================================

    {
      id: 6,
      title: 'Offline QR',
      description:
        'Collect payments instantly using static or dynamic QR codes.',
      category: 'In-Person Payment',
      status: 'inactive',
      icon: 'bi-qr-code',
      primaryAction: 'Raise Request',
      secondaryAction: 'Know More'
    },

    {
      id: 7,
      title: 'WhatsApp Commerce',
      description:
        'Sell and collect payments directly through WhatsApp.',
      category: 'In-Person Payment',
      status: 'inactive',
      icon: 'bi-whatsapp',
      primaryAction: 'Raise Request',
      secondaryAction: 'Know More'
    },

    // =========================================
    // ADVANCED PAYMENT MODES
    // =========================================

    {
      id: 8,
      title: 'International Payments',
      description:
        'Accept payments globally with multi-currency support.',
      category: 'Advanced Payment Modes',
      status: 'inactive',
      icon: 'bi-credit-card-2-front',
      primaryAction: 'Raise Request',
      secondaryAction: 'Know More'
    },

    {
      id: 9,
      title: 'EMI',
      description:
        'Offer flexible EMI plans for high-value purchases.',
      category: 'Advanced Payment Modes',
      status: 'active',
      icon: 'bi-wallet2',
      primaryAction: 'Explore'
    },

    {
      id: 10,
      title: 'Buy Now Pay Later',
      description:
        'Boost conversions with BNPL options.',
      category: 'Advanced Payment Modes',
      status: 'inactive',
      icon: 'bi-credit-card',
      primaryAction: 'Raise Request',
      secondaryAction: 'Know More'
    },

    {
      id: 11,
      title: 'Maximizer',
      description:
        'AI driven routing and retry engine for failed transactions.',
      category: 'Advanced Payment Modes',
      status: 'inactive',
      icon: 'bi-lightning-charge',
      primaryAction: 'Raise Request',
      secondaryAction: 'Know More'
    },

    // =========================================
    // SETTLEMENT & REFUND
    // =========================================

    {
      id: 12,
      title: 'Split Settlements',
      description:
        'Auto split payments between multiple parties.',
      category: 'Settlement & Refund Upgrades',
      status: 'inactive',
      icon: 'bi-arrow-left-right',
      primaryAction: 'Raise Request',
      secondaryAction: 'Know More'
    },

    {
      id: 13,
      title: 'Instant Refund',
      description:
        'Issue instant refunds across all payment methods.',
      category: 'Settlement & Refund Upgrades',
      status: 'inactive',
      icon: 'bi-arrow-counterclockwise',
      primaryAction: 'Raise Request'
    },

    {
      id: 14,
      title: 'Wallet Refund',
      description:
        'Initiate instant wallet refunds with full control.',
      category: 'Settlement & Refund Upgrades',
      status: 'inactive',
      icon: 'bi-wallet',
      primaryAction: 'Activate'
    },

    // =========================================
    // AFFORDABILITY
    // =========================================

    {
      id: 15,
      title: 'Offer Engine',
      description:
        'Run targeted discounts and cashback campaigns.',
      category: 'Affordability & Wallet',
      status: 'inactive',
      icon: 'bi-percent',
      primaryAction: 'Activate'
    },

    {
      id: 16,
      title: 'Loyalty Suite',
      description:
        'Reward repeat customers with loyalty programs.',
      category: 'Affordability & Wallet',
      status: 'inactive',
      icon: 'bi-award',
      primaryAction: 'Raise Request',
      secondaryAction: 'Know More'
    },

    {
      id: 17,
      title: 'Affordability Widget',
      description:
        'Display EMI and affordability options on product pages.',
      category: 'Affordability & Wallet',
      status: 'active',
      icon: 'bi-phone',
      primaryAction: 'Explore'
    }
  ];

  setTab(tab: 'all' | 'active' | 'inactive'): void {
    this.activeTab = tab;
  }

  get filteredProducts(): Product[] {

    let data = [...this.products];

    if (this.activeTab === 'active') {
      data = data.filter(x => x.status === 'active');
    }

    if (this.activeTab === 'inactive') {
      data = data.filter(x => x.status === 'inactive');
    }

    if (this.searchText.trim()) {

      const search = this.searchText.toLowerCase();

      data = data.filter(item =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search)
      );
    }

    return data;
  }

  get categories(): string[] {

    return [
      ...new Set(
        this.filteredProducts.map(x => x.category)
      )
    ];
  }

  getProductsByCategory(category: string): Product[] {
    return this.filteredProducts.filter(
      x => x.category === category
    );
  }

  scrollToCategory(category: string): void {

    const id = category
      .toLowerCase()
      .replace(/&/g, '')
      .replace(/\s+/g, '-');

    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
  }

  get activeCount(): number {
    return this.products.filter(x => x.status === 'active').length;
  }

  get inactiveCount(): number {
    return this.products.filter(x => x.status === 'inactive').length;
  }
}
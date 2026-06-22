import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface SettingCard {
  icon: string;
  title: string;
  description: string;
  action: string;
  secondaryAction?: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {

  // =========================================
  // GLOBAL SETTINGS
  // =========================================

  globalSettings: SettingCard[] = [

    {
      icon: 'bi-person-badge',
      title: 'Profile Details',
      description:
        'View and manage your profile related information.',
      action: 'View Details'
    },

    {
      icon: 'bi-bank',
      title: 'Account Details',
      description:
        'View and edit your business and bank account details.',
      action: 'Manage Account'
    },

    {
      icon: 'bi-credit-card-2-front',
      title: 'Payment Methods',
      description:
        'Manage payment methods available for your checkout.',
      action: 'Activate Now'
    },

    {
      icon: 'bi-people',
      title: 'Users & Permissions',
      description:
        'Create roles, assign permissions and manage employees.',
      action: 'Add Employee',
      secondaryAction: 'Add Role'
    },

    {
      icon: 'bi-bell',
      title: 'Notifications',
      description:
        'Manage email alerts and notification preferences.',
      action: 'Get Notified'
    },

    {
      icon: 'bi-cart-check',
      title: 'Checkout Settings',
      description:
        'Customize your checkout experience for customers.',
      action: 'Configure Now'
    },

    {
      icon: 'bi-sliders',
      title: 'Preferences',
      description:
        'Manage settlement, refund and transaction preferences.',
      action: 'Change Preferences'
    },

    {
      icon: 'bi-diagram-3',
      title: 'Webhooks',
      description:
        'Configure webhook URLs and event notifications.',
      action: 'Configure Now'
    }
  ];

  // =========================================
  // PRODUCT CONFIGURATION
  // =========================================

  productConfigurations: SettingCard[] = [

    {
      icon: 'bi-wallet2',
      title: 'Payouts',
      description:
        'Configure payout workflows, approvals and rules.',
      action: 'Manage Payouts'
    },

    {
      icon: 'bi-percent',
      title: 'Offers & Promotion',
      description:
        'Configure refund offers and promotional settings.',
      action: 'Configure Offers'
    }
  ];

  // =========================================
  // ACTIONS
  // =========================================

  handleAction(card: SettingCard): void {

    console.log(
      'Primary Action:',
      card.title
    );

  }

  handleSecondaryAction(card: SettingCard): void {

    console.log(
      'Secondary Action:',
      card.title
    );

  }

}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface IntegrationOption {
  id: number;
  title: string;
  description: string;
  image: string;
  documentation: string;
}

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './payment-gateway.html',
  styleUrl: './payment-gateway.scss'
})

export class PaymentGateway {

  /* =========================================
     TABS
  ========================================= */

  activeTab: 'web' | 'sdk' | 'plugin' = 'web';

  /* =========================================
     WEB CHECKOUT
  ========================================= */

  webCheckoutOptions: IntegrationOption[] = [

    {
      id: 1,
      title: 'Hosted Checkout',
      description:
        'BankU Hosted Checkout redirects customers to a secure hosted payment page. It is the fastest way to integrate online payments.',
      image: 'assets/images/payment-gateway/hosted-checkout.svg',
      documentation: '#'
    },

    {
      id: 2,
      title: 'Merchant Checkout',
      description:
        'Merchant Checkout allows complete control over the checkout experience while securely processing payments using BankU APIs.',
      image: 'assets/images/payment-gateway/merchant-checkout.svg',
      documentation: '#'
    }

  ];

  /* =========================================
     MOBILE SDK
  ========================================= */

  mobileSdkOptions: IntegrationOption[] = [

    {
      id: 1,
      title: 'Android SDK',
      description:
        'Integrate BankU Android SDK into your native Android application with minimal development effort.',
      image: 'assets/images/payment-gateway/android.svg',
      documentation: '#'
    },

    {
      id: 2,
      title: 'iOS SDK',
      description:
        'Secure native payment integration for iOS applications with BankU SDK.',
      image: 'assets/images/payment-gateway/ios.svg',
      documentation: '#'
    },

    {
      id: 3,
      title: 'Flutter SDK',
      description:
        'Single codebase payment integration using Flutter SDK.',
      image: 'assets/images/payment-gateway/flutter.svg',
      documentation: '#'
    }

  ];

  /* =========================================
     PLUGIN
  ========================================= */

  pluginOptions: IntegrationOption[] = [

    {
      id: 1,
      title: 'WooCommerce',
      description:
        'Install BankU payment plugin for WooCommerce.',
      image: 'assets/images/payment-gateway/woocommerce.svg',
      documentation: '#'
    },

    {
      id: 2,
      title: 'Magento',
      description:
        'Official BankU Magento payment extension.',
      image: 'assets/images/payment-gateway/magento.svg',
      documentation: '#'
    },

    {
      id: 3,
      title: 'OpenCart',
      description:
        'Simple payment integration using OpenCart plugin.',
      image: 'assets/images/payment-gateway/opencart.svg',
      documentation: '#'
    },

    {
      id: 4,
      title: 'PrestaShop',
      description:
        'Official BankU PrestaShop plugin.',
      image: 'assets/images/payment-gateway/prestashop.svg',
      documentation: '#'
    },

    {
      id: 5,
      title: 'Shopify',
      description:
        'Connect your Shopify store with BankU.',
      image: 'assets/images/payment-gateway/shopify.svg',
      documentation: '#'
    }

  ];

  /* =========================================
     SELECTED ITEMS
  ========================================= */

  selectedWebCheckout = 1;

  selectedSdk = 1;

  selectedPlugin = 1;

  /* =========================================
     MERCHANT DETAILS
  ========================================= */

  merchantKey = 'LHps9s';

  salts = [

    'Active Salt',

    'Salt 2',

    'Salt 3'

  ];

  selectedSalt = 'Active Salt';

  liveMode = true;
showClientSecretPopup = false;

password = '';

openClientSecretPopup(): void {

  this.showClientSecretPopup = true;

}

closeClientSecretPopup(): void {

  this.showClientSecretPopup = false;

  this.password = '';

}

verifyPassword(): void {

  console.log(this.password);

  // API Call later

  this.closeClientSecretPopup();

}
  /* =========================================
     ACTIONS
  ========================================= */

  changeTab(tab: 'web' | 'sdk' | 'plugin'): void {

    this.activeTab = tab;

  }

  selectWebCheckout(id: number): void {

    this.selectedWebCheckout = id;

  }

  selectSdk(id: number): void {

    this.selectedSdk = id;

  }

  selectPlugin(id: number): void {

    this.selectedPlugin = id;

  }

 showSalt = false;


secretSalt = 'QwErTy123456789';

copyMerchantKey(): void {

  navigator.clipboard.writeText(this.merchantKey).then(() => {

    alert('Merchant Key Copied Successfully.');

  });

}

copySecretSalt(): void {

  navigator.clipboard.writeText(this.secretSalt).then(() => {

    alert('Secret Salt Copied Successfully.');

  });

}

  viewDocumentation(url: string): void {

    console.log('Documentation:', url);

  }

  getClientDetails(): void {

    console.log('Get Client Details');

  }

  launchSimulator(): void {

    console.log('Launch Simulator');

  }

}
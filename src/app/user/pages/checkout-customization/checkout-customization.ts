import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type ActiveTab =
  | 'branding'
  | 'features';

type PreviewMode =
  | 'desktop'
  | 'mobile';

@Component({
  selector: 'app-checkout-customization',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './checkout-customization.html',
  styleUrl: './checkout-customization.scss'
})
export class CheckoutCustomization {
        
  /* =========================================
     ACTIVE TAB
  ========================================= */

  activeTab: ActiveTab = 'branding';

  setTab(tab: ActiveTab): void {

    this.activeTab = tab;

  }

  /* =========================================
     PREVIEW MODE
  ========================================= */

  previewMode: PreviewMode = 'desktop';

  changePreview(mode: PreviewMode): void {

    this.previewMode = mode;

  }

  /* =========================================
     MERCHANT DETAILS
  ========================================= */

  merchantName = 'Test User';

  amount = '₹1.00';

  /* =========================================
     LOGO
  ========================================= */

  logoUrl = 'assets/images/bankulogo.png';

  uploadLogo(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    const reader = new FileReader();

    reader.onload = () => {

      this.logoUrl =
        reader.result as string;

    };

    reader.readAsDataURL(file);

  }

  /* =========================================
     SIGNATURE
  ========================================= */
signatureUrl: string | null = null;
  /* =========================================
     BRAND COLORS
  ========================================= */

  primaryColor = '#009688';
  secondaryColor = '#2962FF';

  colors = [
    '#009688',
    '#2962FF',
    '#FF9800',
    '#EF5350',
    '#800180',
    '#212121'
  ];

  setPrimaryColor(color: string): void {

    this.primaryColor = color;

  }

  setSecondaryColor(color: string): void {

    this.secondaryColor = color;

  }

  /* =========================================
     LANGUAGE
  ========================================= */

  selectedLanguage = 'English';

  languages = [

    'English',
    'Hindi',
    'Gujarati',
    'Marathi',
    'Tamil',
    'Telugu'

  ];

  /* =========================================
     PAYMENT METHODS
  ========================================= */

  paymentMethods = [

    'UPI',

    'Cards',

    'Net Banking',

    'Wallet',

    'EMI',

    'Pay Later'

  ];

  /* =========================================
     FEATURES
  ========================================= */

  recommendedOrder = false;

  customOrder = true;

  toggleAiRecommendation(): void {

    this.recommendedOrder =
      !this.recommendedOrder;

  }

  toggleCustomOrder(): void {

    this.customOrder =
      !this.customOrder;

  }

  /* =========================================
     SAVE
  ========================================= */

  saveCustomization(): void {

    console.log({

      logo: this.logoUrl,

      signature: this.signatureUrl,

      primaryColor: this.primaryColor,

      secondaryColor: this.secondaryColor,

      language: this.selectedLanguage,

      preview: this.previewMode,

      recommendedOrder: this.recommendedOrder,

      customOrder: this.customOrder

    });

  }

  /* =========================================
     RESET
  ========================================= */

  resetCustomization(): void {

    this.logoUrl =
      'assets/images/logo.png';

    this.signatureUrl = '';

    this.primaryColor =
      '#009688';

    this.secondaryColor =
      '#2962FF';

    this.selectedLanguage =
      'English';

    this.previewMode =
      'desktop';

    this.recommendedOrder = false;

    this.customOrder = true;

  }

}
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class UserDashboard {

  /* =========================================
     PAYMENT HANDLE
  ========================================= */

  paymentLink =
    'https://banku.in/pay/BKU12991266';

  customerContact = '';

  /* =========================================
     SHARE MODAL
  ========================================= */

  isShareModalOpen = false;

  openShareModal(): void {

    this.isShareModalOpen = true;

  }

  closeShareModal(): void {

    this.isShareModalOpen = false;

  }

  /* =========================================
     COPY LINK
  ========================================= */

  async copyLink(): Promise<void> {

    try {

      await navigator.clipboard.writeText(
        this.paymentLink
      );

      alert(
        'Payment link copied successfully'
      );

    } catch {

      alert(
        'Unable to copy link'
      );

    }

  }

  /* =========================================
     WHATSAPP SHARE
  ========================================= */

  shareWhatsapp(): void {

    const text =
      `Pay using this link: ${this.paymentLink}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    );

  }

  /* =========================================
     FACEBOOK SHARE
  ========================================= */

  shareFacebook(): void {

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.paymentLink)}`,
      '_blank'
    );

  }

  /* =========================================
     SEND LINK
  ========================================= */

  sendLink(): void {

    if (!this.customerContact.trim()) {

      alert(
        'Please enter mobile number or email'
      );

      return;

    }

    alert(
      `Payment link sent to ${this.customerContact}`
    );

    this.customerContact = '';

    this.closeShareModal();

  }

  /* =========================================
     EXPLORE PRODUCTS
  ========================================= */

  exploreProducts(): void {

    alert(
      'Explore Products page coming soon.'
    );

  }


  /* =========================================
   INTEGRATION SELECTION
========================================= */

selectedIntegration:
  'hosted'
  | 'merchant'
  | 'plugin'
  | null = null;

selectIntegration(
  type: 'hosted' | 'merchant' | 'plugin'
): void {

  this.selectedIntegration = type;

  this.activeStep = 1;

}

closeIntegration(): void {

  this.selectedIntegration = null;
 
  this.activeStep = 1;

}
/* =========================================
   STEPPER
========================================= */

activeStep = 1;

toggleStep(step: number): void {

  if (this.activeStep === step) {

    this.activeStep = 0;

    return;

  }

  this.activeStep = step;

}

/* =========================================
   COPY TEXT
========================================= */

copyText(value: string): void {

  navigator.clipboard.writeText(value);

  alert('Copied Successfully');

}
  /* =========================================
     ACTIVATE MORE
  ========================================= */

  activateMore(): void {

    alert(
      'Activate More feature coming soon.'
    );

  }

}


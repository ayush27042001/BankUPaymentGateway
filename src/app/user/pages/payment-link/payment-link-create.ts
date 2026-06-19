import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-link-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './payment-link-create.html',
  styleUrl: './payment-link-create.scss'
})
export class PaymentLinkCreateComponent {

  /* ==========================================
     PAYMENT LINK DETAILS
  ========================================== */

  itemDescription = '';

  totalAmount: number | null = null;

  transactionLimit: number | null = null;

  limitType = 'Transactions';

  /* ==========================================
     EXPIRY
  ========================================== */

  enableExpiry = false;

  selectedExpiry = 'Select Expiry';

  showExpiryDropdown = false;

  expiryOptions = [
    '1 Day',
    '3 Days',
    '7 Days',
    '15 Days',
    '30 Days',
    '60 Days',
    '90 Days'
  ];

  /* ==========================================
     PARTIAL PAYMENT
  ========================================== */

  enablePartialPayment = false;

  /* ==========================================
     MORE DETAILS
  ========================================== */

  showMoreDetails = false;

  /* ==========================================
     METHODS
  ========================================== */

  toggleExpiry() {

    this.showExpiryDropdown = !this.showExpiryDropdown;

  }

  selectExpiry(item: string) {

    this.selectedExpiry = item;

    this.showExpiryDropdown = false;

  }

  toggleMoreDetails() {

    this.showMoreDetails = !this.showMoreDetails;

  }

  /* ==========================================
   CUSTOMER TARGETING
========================================== */

customerName = '';

customerMobile = '';

customerEmail = '';

sendSms = true;

sendEmail = false;

prefillCustomer = true;

allowEditCustomer = false;


/* ==========================================
   CUSTOMER DATA CAPTURE
========================================== */

collectName = true;

collectMobile = true;

collectEmail = true;

collectAddress = false;

collectCity = false;

collectState = false;

collectPincode = false;

collectGST = false;

collectPAN = false;

customFields = [
  {
    label: 'Custom Field 1',
    required: false
  }
];
addCustomField() {

  this.customFields.push({

    label: 'New Field',

    required: false

  });

}

removeField(index:number){

  this.customFields.splice(index,1);

}
/* ==========================================
   PREVIEW DATA
========================================== */

merchantName = 'BankU India';

paymentTitle = 'Payment Request';

currency = '₹';

previewAmount = 0;

paymentDueDate = '19 Jun 2026 | 10:38 AM';

merchantLogo = 'assets/images/logo.png';

paymentModes = [
  'UPI',
  'Credit / Debit Card',
  'Net Banking',
  'Wallet',
  'EMI'
];
}
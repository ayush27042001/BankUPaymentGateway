import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
 constructor(private router: Router) {}
 goBackToPaymentLinks() {

  this.router.navigate(['/user/payment-link']);

}goToPaymentLink(): void {

  this.router.navigate(['/user/payment-link']);

}
goToPaymentMode(): void {

  this.router.navigate(['/user/payment-mode']);

}
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

  /* ==========================================
     CUSTOMER DATA CAPTURE
  ========================================== */

  fieldTypes = ['Text', 'Number', 'Email', 'Date', 'Dropdown'];

  showFieldPopup = false;

  editingFieldIndex: number | null = null;

  newFieldType = 'Text';

  newFieldName = '';

  customFields: { type: string; label: string }[] = [];

  openAddFieldPopup() {
    this.editingFieldIndex = null;
    this.newFieldType = 'Text';
    this.newFieldName = '';
    this.showFieldPopup = true;
  }

  openEditFieldPopup(index: number) {
    this.editingFieldIndex = index;
    const field = this.customFields[index];
    this.newFieldType = field.type;
    this.newFieldName = field.label;
    this.showFieldPopup = true;
  }

  saveField() {
    if (!this.newFieldName.trim()) return;
    if (this.editingFieldIndex !== null) {
      this.customFields[this.editingFieldIndex] = {
        type: this.newFieldType,
        label: this.newFieldName
      };
    } else {
      this.customFields.push({
        type: this.newFieldType,
        label: this.newFieldName
      });
    }
    this.showFieldPopup = false;
  }

  cancelFieldPopup() {
    this.showFieldPopup = false;
  }

  removeField(index: number) {
    this.customFields.splice(index, 1);
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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingHeaderComponent } from '../../components/onboarding-header/onboarding-header';

@Component({
  selector: 'app-share-business-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent],
  templateUrl: './share-business-details.html',
  styleUrl: './share-business-details.scss',
})
export class ShareBusinessDetailsComponent {
  businessForm: FormGroup;
  salesInWords = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.businessForm = this.fb.group({
      expectedSales: ['', [Validators.required, this.expectedSalesValidator]],
      hasGstin: [false],
      gstin: [{ value: '', disabled: true }],
    });

    this.updateSalesWords('');

    this.businessForm.get('hasGstin')?.valueChanges.subscribe((hasGstin: boolean) => {
      const gstinControl = this.businessForm.get('gstin');

      if (hasGstin) {
        gstinControl?.enable();
        gstinControl?.setValidators([Validators.required, this.gstinValidator]);
      } else {
        gstinControl?.reset('');
        gstinControl?.clearValidators();
        gstinControl?.disable();
      }

      gstinControl?.updateValueAndValidity();
    });
  }

  get f() {
    return this.businessForm.controls;
  }

  expectedSalesValidator(control: AbstractControl): ValidationErrors | null {
    const rawValue = (control.value || '').toString().replace(/,/g, '').trim();

    if (!rawValue) {
      return null;
    }

    return /^[0-9]+$/.test(rawValue) ? null : { invalidAmount: true };
  }

  gstinValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').toString().trim().toUpperCase();

    if (!value) {
      return null;
    }

    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)
      ? null
      : { invalidGstin: true };
  }

  onExpectedSalesInput(): void {
    const control = this.businessForm.get('expectedSales');
    const rawValue = (control?.value || '').toString();

    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 9);

    if (!digitsOnly) {
      control?.setValue('', { emitEvent: false });
      this.updateSalesWords('');
      return;
    }

    const formattedValue = this.formatIndianNumber(digitsOnly);
    control?.setValue(formattedValue, { emitEvent: false });
    this.updateSalesWords(digitsOnly);
  }

  onGstinInput(): void {
    const control = this.businessForm.get('gstin');
    const rawValue = (control?.value || '').toString();
    const formattedValue = rawValue.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);

    if (rawValue !== formattedValue) {
      control?.setValue(formattedValue, { emitEvent: false });
    }
  }

  updateSalesWords(value: string): void {
    const numericValue = Number(value);

    if (!value || Number.isNaN(numericValue) || numericValue <= 0) {
      this.salesInWords = '';
      return;
    }

    this.salesInWords = this.convertNumberToWordsIndian(numericValue);
  }

  formatIndianNumber(value: string): string {
    const lastThree = value.slice(-3);
    const otherNumbers = value.slice(0, -3);

    if (!otherNumbers) {
      return lastThree;
    }

    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  convertNumberToWordsIndian(num: number): string {
    if (num === 0) return 'Zero';

    const ones = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen',
    ];

    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const twoDigits = (n: number): string => {
      if (n < 20) return ones[n];
      return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    };

    const threeDigits = (n: number): string => {
      let str = '';
      if (Math.floor(n / 100) > 0) {
        str += ones[Math.floor(n / 100)] + ' Hundred';
        if (n % 100) str += ' ';
      }
      if (n % 100) {
        str += twoDigits(n % 100);
      }
      return str;
    };

    let result = '';
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = num % 1000;

    if (crore) result += twoDigits(crore) + ' Crore ';
    if (lakh) result += twoDigits(lakh) + ' Lakh ';
    if (thousand) result += twoDigits(thousand) + ' Thousand ';
    if (hundred) result += threeDigits(hundred);

    return result.trim();
  }

  onSubmit(): void {
    this.businessForm.markAllAsTouched();

    if (this.businessForm.invalid) {
      return;
    }

    const payload = {
      expectedSales: this.businessForm.get('expectedSales')?.value,
      hasGstin: this.businessForm.get('hasGstin')?.value,
      gstin: this.businessForm.get('gstin')?.value,
    };

    console.log('Business details payload:', payload);

    this.router.navigate(['/connect-platform']);
  }

  goBack(): void {
    this.router.navigate(['/business-category']);
  }
}
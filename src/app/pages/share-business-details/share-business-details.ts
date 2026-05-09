import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { ToastComponent } from '../../components/toast/toast';
import { BusinessDetailsService } from '../../services/business-details/business-details.service';
import { ToastService } from '../../services/toast/toast.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-share-business-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent, ToastComponent],
  templateUrl: './share-business-details.html',
  styleUrl: './share-business-details.scss',
})
export class ShareBusinessDetailsComponent implements OnInit {
  businessForm: FormGroup;
  salesInWords = '';
  loading = false;
  saving = false;
  validatingGst = false;
  gstValidationStatus: 'valid' | 'invalid' | 'pending' | null = null;
  private gstDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private businessDetailsService: BusinessDetailsService,
    private toastService: ToastService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
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

  ngOnInit(): void {
    this.loadBusinessDetails();
  }

  loadBusinessDetails(): void {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.businessDetailsService.getBusinessDetails().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const data = response.data;
          this.businessForm.patchValue({
            hasGstin: data.hasGstin,
            gstin: data.gstin || '',
          });

          if (data.hasGstin && data.gstin && data.gstin.length === 15) {
            this.validateGstSilent(data.gstin);
          }

          if (data.expectedSalesPerMonth) {
            // Convert from lakhs to rupees for display
            const salesInRupees = Math.round(data.expectedSalesPerMonth * 100);
            const formattedSales = this.formatIndianNumber(salesInRupees.toString());
            this.businessForm.patchValue({
              expectedSales: formattedSales,
            });
            this.updateSalesWords(salesInRupees.toString());
          }

          // Check onboarding status and redirect if needed
          if (data.isOnboardingRejected) {
            this.router.navigate(['/onboarding-rejected']);
            return;
          }
          if (data.isServiceAgreementSubmitted && !data.isOnboardingCompleted && !data.isOnboardingRejected) {
            this.router.navigate(['/status-tracker']);
            return;
          }
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading business details:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
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

    if (this.gstDebounceTimer) {
      clearTimeout(this.gstDebounceTimer);
    }

    if (formattedValue.length === 15) {
      this.gstDebounceTimer = setTimeout(() => {
        this.validateGst(formattedValue);
      }, 600);
    } else {
      this.gstValidationStatus = null;
      this.validatingGst = false;
    }
  }

  validateGstSilent(gstin: string): void {
    this.validatingGst = true;
    this.gstValidationStatus = 'pending';
    this.cdr.detectChanges();

    this.businessDetailsService.validateGst({ gstin, businessName: '' }).subscribe({
      next: (response) => {
        this.gstValidationStatus = (response.success && response.data?.legalName) ? 'valid' : 'invalid';
        this.validatingGst = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.gstValidationStatus = 'invalid';
        this.validatingGst = false;
        this.cdr.detectChanges();
      }
    });
  }

  validateGst(gstin: string): void {
    this.validatingGst = true;
    this.gstValidationStatus = 'pending';

    this.businessDetailsService.validateGst({
      gstin: gstin,
      businessName: ''
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const isValid = !!response.data.legalName;
          if (isValid) {
            this.gstValidationStatus = 'valid';
            this.toastService.success(`GSTIN verified: ${response.data.legalName}`);
          } else {
            this.gstValidationStatus = 'invalid';
            this.toastService.error('GSTIN verification failed. Please check your GSTIN.');
          }
        }
        this.validatingGst = false;
      },
      error: (err) => {
        console.error('Error validating GST:', err);
        this.gstValidationStatus = 'invalid';
        this.toastService.error('Failed to validate GSTIN');
        this.validatingGst = false;
      }
    });
  }

  updateSalesWords(value: string): void {
    const numericValue = Number(value);

    if (!value || Number.isNaN(numericValue) || numericValue <= 0) {
      this.salesInWords = '';
      return;
    }

    const words = this.convertNumberToWordsIndian(numericValue);
    this.salesInWords = words || '';
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

    // Check if GST validation is in progress
    if (this.validatingGst) {
      this.toastService.warning('Please wait for GST validation to complete');
      return;
    }

    // Check if GST is invalid
    if (this.businessForm.get('hasGstin')?.value && this.gstValidationStatus === 'invalid') {
      this.toastService.error('Please enter a valid GSTIN before proceeding');
      return;
    }

    const expectedSalesRaw = (this.businessForm.get('expectedSales')?.value || '').toString().replace(/,/g, '').trim();
    const expectedSalesPerMonth = Number(expectedSalesRaw) / 100; // Convert to lakhs as per API

    const payload = {
      expectedSalesPerMonth: expectedSalesPerMonth,
      hasGstin: this.businessForm.get('hasGstin')?.value,
      gstin: this.businessForm.get('hasGstin')?.value ? this.businessForm.get('gstin')?.value : undefined,
    };

    this.saving = true;
    this.businessDetailsService.saveBusinessDetails(payload).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Update auth data with onboarding status
          this.authService.setAuthData(
            this.authService.getToken() || '',
            this.authService.getUserId() || '',
            this.authService.getMid() || '',
            this.authService.getUserData(),
            this.authService.getRefreshToken() || undefined,
            this.authService.getTokenExpiration() || undefined,
            this.authService.getRefreshTokenExpiration() || undefined,
            response.data.onboardingStatus,
            response.data.isOnboardingCompleted,
            response.data.isServiceAgreementSubmitted,
            response.data.isOnboardingRejected
          );

          // Check onboarding status and redirect if needed
          if (response.data.isOnboardingRejected) {
            this.router.navigate(['/onboarding-rejected']);
            return;
          }
          if (response.data.isServiceAgreementSubmitted && !response.data.isOnboardingCompleted && !response.data.isOnboardingRejected) {
            this.router.navigate(['/status-tracker']);
            return;
          }

          this.router.navigate(['/connect-platform']);
        }
        this.saving = false;
      },
      error: (err) => {
        console.error('Error saving business details:', err);
        this.saving = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/business-category']);
  }
}
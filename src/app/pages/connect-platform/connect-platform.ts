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
  selector: 'app-connect-platform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent],
  templateUrl: './connect-platform.html',
  styleUrl: './connect-platform.scss',
})
export class ConnectPlatformComponent {
  platformForm: FormGroup;
  bankForm: FormGroup;
  imageUrl: string = 'assets/images/website-illustration.png';

  currentStep = 1;

  holderNames: string[] = [
    'Rishabh Pal',
    'Business Owner',
    'Authorized Signatory',
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.platformForm = this.fb.group({
      collectionMode: ['without-website-app', Validators.required],
      websiteUrl: [''],
      androidAppUrl: [''],
      iosAppUrl: [''],
    });

    this.bankForm = this.fb.group({
      bankHolderName: ['', Validators.required],
      bankAccountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
      ifscCode: ['', [Validators.required, this.ifscValidator]],
    });

    this.platformForm.get('collectionMode')?.valueChanges.subscribe((mode: string) => {
      const websiteUrlControl = this.platformForm.get('websiteUrl');
      const androidAppUrlControl = this.platformForm.get('androidAppUrl');
      const iosAppUrlControl = this.platformForm.get('iosAppUrl');

      if (mode === 'website-app') {
        websiteUrlControl?.setValidators([Validators.required, this.urlValidator]);
        androidAppUrlControl?.setValidators([this.urlValidator]);
        iosAppUrlControl?.setValidators([this.urlValidator]);
      } else {
        websiteUrlControl?.reset('');
        websiteUrlControl?.clearValidators();

        androidAppUrlControl?.reset('');
        androidAppUrlControl?.clearValidators();

        iosAppUrlControl?.reset('');
        iosAppUrlControl?.clearValidators();
      }

      websiteUrlControl?.updateValueAndValidity();
      androidAppUrlControl?.updateValueAndValidity();
      iosAppUrlControl?.updateValueAndValidity();
    });
  }

  get f() {
    return this.platformForm.controls;
  }

  get bankControls() {
    return this.bankForm.controls;
  }

  urlValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value || '').toString().trim();

    if (!value) {
      return null;
    }

    const urlPattern =
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-./?%&=]*)?$/i;

    return urlPattern.test(value) ? null : { invalidUrl: true };
  };

  ifscValidator = (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value || '').toString().trim().toUpperCase();

    if (!value) {
      return null;
    }

    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? null : { invalidIfsc: true };
  };

  goToStepTwo(): void {
    this.platformForm.markAllAsTouched();

    if (this.platformForm.invalid) {
      return;
    }

    const payload = {
      collectionMode: this.platformForm.get('collectionMode')?.value,
      websiteUrl: this.platformForm.get('websiteUrl')?.value,
      androidAppUrl: this.platformForm.get('androidAppUrl')?.value,
      iosAppUrl: this.platformForm.get('iosAppUrl')?.value,
    };

    console.log('Platform form value:', payload);
    this.currentStep = 2;
  }

  submitBankDetails(): void {
    this.bankForm.markAllAsTouched();

    if (this.bankForm.invalid) {
      return;
    }

    const payload = {
      bankHolderName: this.bankForm.get('bankHolderName')?.value,
      bankAccountNumber: this.bankForm.get('bankAccountNumber')?.value,
      ifscCode: this.bankForm.get('ifscCode')?.value,
    };

    console.log('Bank details payload:', payload);

    // Final submit or next page action here
  }

  onAccountNumberInput(): void {
    const control = this.bankForm.get('bankAccountNumber');
    const rawValue = (control?.value || '').toString();
    const digitsOnly = rawValue.replace(/\D/g, '').slice(0, 18);

    if (rawValue !== digitsOnly) {
      control?.setValue(digitsOnly, { emitEvent: false });
    }
  }

  onIfscInput(): void {
    const control = this.bankForm.get('ifscCode');
    const rawValue = (control?.value || '').toString();
    const formattedValue = rawValue.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);

    if (rawValue !== formattedValue) {
      control?.setValue(formattedValue, { emitEvent: false });
    }
  }

  goBack(): void {
    if (this.currentStep === 2) {
      this.currentStep = 1;
      return;
    }

    this.router.navigate(['/share-business-details']);
  }
}
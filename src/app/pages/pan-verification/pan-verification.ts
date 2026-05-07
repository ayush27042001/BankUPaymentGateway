import { CommonModule } from '@angular/common';
import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
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
import { AuthService } from '../../services/auth/auth.service';
import { RegistrationService } from '../../services/registration/registration.service';
import { PanService } from '../../services/pan/pan.service';
import { LoaderComponent } from '../../components/loader/loader';

@Component({
  selector: 'app-pan-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent, LoaderComponent],
  templateUrl: './pan-verification.html',
  styleUrl: './pan-verification.scss',
})
export class PanVerificationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private registrationService = inject(RegistrationService);
  private panService = inject(PanService);
  private cdr = inject(ChangeDetectorRef);
  
  panForm!: FormGroup;
  maxDobDate: string = '';
  isSubmitting = false;
  isValidatingPan = false;
  panError: string | null = null;
  apiError: string | null = null;
  panName: string | null = null;

  constructor() {
    this.maxDobDate = this.getTodayDate();

    this.panForm = this.fb.group({
      panNumber: ['', [Validators.required, this.panValidator]],
      fullName: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(3)]],
      dob: [{ value: '', disabled: true }, [Validators.required, this.age18Validator]],
    });

    this.panForm.get('panNumber')?.valueChanges.subscribe((value: string) => {
      const panControl = this.panForm.get('panNumber');
      const fullNameControl = this.panForm.get('fullName');
      const dobControl = this.panForm.get('dob');

      if (!value) {
        this.panError = null;
        this.panName = null;
        fullNameControl?.reset();
        dobControl?.reset();
        fullNameControl?.disable();
        dobControl?.disable();
        this.cdr.detectChanges();
        return;
      }

      const upperValue = value.toUpperCase();
      if (value !== upperValue) {
        panControl?.setValue(upperValue, { emitEvent: false });
      }

      if (panControl?.valid) {
        // Call PAN validation API when PAN format is valid
        this.validatePanAndVerify();
        fullNameControl?.enable();
        dobControl?.enable();
      } else {
        this.panError = null;
        this.panName = null;
        fullNameControl?.reset();
        dobControl?.reset();
        fullNameControl?.disable();
        dobControl?.disable();
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    this.loadPanDetails();
  }

  loadPanDetails(): void {
    this.panService.getPanDetails().subscribe({
      next: (response) => {
        console.log('PAN Details Response:', response);

        if (response.success && response.data) {
          const panDetails = response.data;

          // Populate form with existing PAN details
          this.panForm.patchValue({
            panNumber: panDetails.panCardNumber,
            fullName: panDetails.nameOnPanCard,
            dob: panDetails.dateOfBirthOrIncorporation?.split('T')[0],
          });

          // Enable the form fields since data exists
          this.panForm.get('fullName')?.enable();
          this.panForm.get('dob')?.enable();

          this.panName = panDetails.nameOnPanCard;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.log('Get PAN Details Error:', error);
        // If 404 or similar error, it means no PAN details exist yet (new user)
        // This is expected, so we don't show an error
        if (error.status !== 404) {
          console.error('Failed to load PAN details:', error);
        }
      },
    });
  }

  get f() {
    return this.panForm.controls;
  }

  get isPanValid(): boolean {
    return !!this.panForm.get('panNumber')?.valid;
  }

  panValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim()?.toUpperCase();
    if (!value) return null;

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    return panRegex.test(value) ? null : { invalidPan: true };
  }

  age18Validator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const dob = new Date(value);
    const today = new Date();

    if (isNaN(dob.getTime())) {
      return { invalidDate: true };
    }

    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age >= 18 ? null : { underAge: true };
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onBack(): void {
    this.router.navigate(['/']);
  }

  onSubmit(): void {
    if (this.panForm.invalid) {
      this.panForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.apiError = null;
    this.cdr.detectChanges();

    const panNumber = this.panForm.value.panNumber;
    const nameOnPanCard = this.panForm.value.fullName;
    const dateOfBirthOrIncorporation = this.panForm.value.dob;

    this.panService.completePan({
      panCardNumber: panNumber,
      nameOnPanCard: nameOnPanCard,
      dateOfBirthOrIncorporation: dateOfBirthOrIncorporation,
    }).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        console.log('Complete PAN Response:', response);

        if (response.success) {
          // Update auth data if new token is provided
          if (typeof response.data === 'object' && response.data.token) {
            this.authService.setAuthData(
              response.data.token,
              response.data.userId.toString(),
              response.data.mid.toString(),
              {
                userName: response.data.userName,
                email: response.data.email,
              }
            );
          }
          this.router.navigate(['/business-entity']);
        } else {
          this.apiError = response.message || 'Failed to save PAN details';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.log('Complete PAN Error:', error);
        
        // Handle different error status codes
        if (error.status === 401) {
          this.authService.clearAuth();
          this.router.navigate(['/login']);
        } else {
          const errorMessage = error.error?.message || error.error || 'Failed to save PAN details. Please try again.';
          this.apiError = errorMessage;
          this.cdr.detectChanges();
        }
      },
    });
  }

  private validatePanAndVerify(): void {
    const panNumber = this.panForm.get('panNumber')?.value?.toUpperCase();
    if (!panNumber) return;

    this.isValidatingPan = true;
    this.panError = null;
    this.panName = null;
    this.cdr.detectChanges();

    // First validate PAN format
    this.registrationService.validatePan(panNumber).subscribe({
      next: (response) => {
        console.log('Validate PAN Response:', response);

        if (!response.success || !response.data.isValidFormat) {
          this.panError = response.message || 'Invalid PAN format';
          this.isValidatingPan = false;
          this.cdr.detectChanges();
          return;
        }

        if (response.data.isAlreadyRegistered) {
          this.panError = 'This PAN is already registered with another account';
          this.isValidatingPan = false;
          this.cdr.detectChanges();
          return;
        }

        // If format is valid, verify with Cashfree
        this.registrationService.verifyPanCashfree(panNumber).subscribe({
          next: (verifyResponse) => {
            this.isValidatingPan = false;
            console.log('Verify PAN Cashfree Response:', verifyResponse);

            if (verifyResponse.success) {
              if (!verifyResponse.data.isValid && !verifyResponse.data.nameMatches) {
                this.panError = verifyResponse.data.message || 'PAN verification failed';
                this.cdr.detectChanges();
                return;
              }

              if (verifyResponse.data.name) {
                this.panName = verifyResponse.data.name;
                this.panForm.get('fullName')?.setValue(verifyResponse.data.name);
                this.panForm.get('fullName')?.enable();
                this.cdr.detectChanges();
              }
            } else {
              this.panError = verifyResponse.message || 'PAN verification failed';
              this.cdr.detectChanges();
            }
          },
          error: (error) => {
            this.isValidatingPan = false;
            console.log('Verify PAN Cashfree Error:', error);
            this.panError = 'Failed to verify PAN. Please try again.';
            this.cdr.detectChanges();
          },
        });
      },
      error: (error) => {
        this.isValidatingPan = false;
        console.log('Validate PAN Error:', error);
        this.panError = 'Failed to validate PAN. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}
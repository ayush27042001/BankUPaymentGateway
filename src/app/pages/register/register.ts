import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, QueryList, ViewChildren, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration/registration.service';
import { LoaderComponent } from '../../components/loader/loader';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private registrationService = inject(RegistrationService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  isPasswordVisible = false;
  showOtpModal = false;
  otpTimer = 300;
  private otpInterval: ReturnType<typeof setInterval> | null = null;
  isSubmitting = false;
  registrationToken: string | null = null;
  apiError: string | null = null;
  serverErrors: { [key: string]: string } = {};
  isVerifyingOtp = false;
  isResendingOtp = false;
  otpError: string | null = null;

  registerForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, this.passwordStrengthValidator]],
    mobileNumber: [
      '',
      [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
    ],
    companyWebsite: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-./?%&=]*)?$/
        ),
      ],
    ],
    businessName: ['', [Validators.required, Validators.minLength(2)]],
  });

  otpForm: FormGroup = this.fb.group({
    otp0: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
  });

  constructor() {
    this.registrationToken = this.authService.getRegistrationToken();
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get mobileNumber() {
    return this.registerForm.get('mobileNumber');
  }

  get companyWebsite() {
    return this.registerForm.get('companyWebsite');
  }

  get businessName() {
    return this.registerForm.get('businessName');
  }

  get passwordValue(): string {
    return this.password?.value || '';
  }

  get hasMinLength(): boolean {
    return this.passwordValue.length >= 8;
  }

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.passwordValue);
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.passwordValue);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.passwordValue);
  }

  get hasSpecialCharacter(): boolean {
    return /[^A-Za-z0-9]/.test(this.passwordValue);
  }

  get isPasswordStrong(): boolean {
    return (
      this.hasMinLength &&
      this.hasUppercase &&
      this.hasLowercase &&
      this.hasNumber &&
      this.hasSpecialCharacter
    );
  }

  get otpControls(): string[] {
    return ['otp0', 'otp1', 'otp2', 'otp3', 'otp4', 'otp5'];
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  sendOtp(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.apiError = null;

    const registrationData = {
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      mobileNumber: this.registerForm.value.mobileNumber,
      companyWebsite: this.registerForm.value.companyWebsite,
      businessName: this.registerForm.value.businessName,
    };

    this.registrationService.initiateRegistration(registrationData).subscribe({
      next: (response: any) => {
        this.isSubmitting = false;

        if (response.success) {
          this.registrationToken = response.data.registrationToken;
          if (this.registrationToken) {
            this.authService.setRegistrationToken(this.registrationToken);
          }
          this.showOtpModal = true;
          this.resetOtpForm();
          this.startOtpTimer();
          this.cdr.detectChanges();

          setTimeout(() => {
            this.focusOtpInput(0);
          }, 50);
        } else {
          this.handleApiError(response);
        }
      },
      error: (error) => {
        console.log('HTTP Error:', error);
        console.log('Error status:', error.status);
        console.log('Error body:', error.error);
        this.isSubmitting = false;
        this.handleApiError(error.error || error);
      },
    });
  }

  closeOtpModal(): void {
    this.showOtpModal = false;
    this.stopOtpTimer();
    this.resetOtpForm();
    this.otpError = null;
  }

  submitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const finalOtp = this.otpControls
      .map((key) => this.otpForm.get(key)?.value || '')
      .join('');

    if (!this.registrationToken) {
      this.otpError = 'Registration session expired. Please start again.';
      this.cdr.detectChanges();
      return;
    }

    this.isVerifyingOtp = true;
    this.otpError = null;
    this.cdr.detectChanges();

    const verifyOtpData = {
      mobileNumber: this.registerForm.value.mobileNumber,
      otp: finalOtp,
      registrationToken: this.registrationToken,
    };

    this.registrationService.verifyOtp(verifyOtpData).subscribe({
      next: (response) => {
        this.isVerifyingOtp = false;
        console.log('Verify OTP Response:', response);

        if (response.success && response.data.isVerified) {
          // Store auth data using auth service
          if (response.data.token && response.data.userId && response.data.mid) {
            this.authService.setAuthData(
              response.data.token,
              response.data.userId.toString(),
              response.data.mid.toString(),
              {
                userName: response.data.userName,
                email: response.data.email,
                mobileNumber: response.data.mobileNumber,
                companyWebsite: response.data.companyWebsite
              },
              undefined,
              undefined,
              undefined,
              undefined,
              response.data.isOnboardingCompleted,
              response.data.isServiceAgreementSubmitted,
              response.data.isOnboardingRejected
            );
          }

          this.stopOtpTimer();
          this.showOtpModal = false;
          const redirectRoute = this.authService.getActiveRouteBasedOnOnboarding();
          this.router.navigate([redirectRoute]);
        } else {
          this.otpError = response.data.message || response.message;
          this.cdr.detectChanges();

          // If session expired, close modal and reset
          if (response.data.message?.toLowerCase().includes('expired')) {
            setTimeout(() => {
              this.closeOtpModal();
              this.registrationToken = null;
              this.authService.clearRegistrationToken();
            }, 2000);
          }
        }
      },
      error: (error) => {
        this.isVerifyingOtp = false;
        console.log('Verify OTP Error:', error);
        console.log('Error body:', error.error);
        
        // Extract actual error message from API response
        const errorMessage = error.error?.data?.message || error.error?.message || error.message || 'An error occurred. Please try again.';
        this.otpError = errorMessage;
        this.cdr.detectChanges();

        // If maximum attempts exceeded, close modal and redirect
        if (errorMessage.toLowerCase().includes('maximum otp attempts exceeded')) {
          setTimeout(() => {
            this.closeOtpModal();
            this.registrationToken = null;
            this.authService.clearRegistrationToken();
            this.authService.clearAuth();
            this.router.navigate(['/register']);
          }, 3000);
        }
      },
    });
  }

  resendOtp(): void {
    if (this.otpTimer > 0 || this.isResendingOtp) return;

    if (!this.registrationToken) {
      this.otpError = 'Registration session expired. Please start again.';
      this.cdr.detectChanges();
      return;
    }

    this.isResendingOtp = true;
    this.otpError = null;
    this.cdr.detectChanges();

    this.registrationService
      .resendOtp(
        this.registerForm.value.mobileNumber,
        this.registrationToken
      )
      .subscribe({
        next: (response) => {
          this.isResendingOtp = false;
          console.log('Resend OTP Response:', response);

          if (response.success) {
            this.resetOtpForm();
            this.startOtpTimer();

            setTimeout(() => {
              this.focusOtpInput(0);
            }, 50);
          } else {
            this.otpError = response.message || 'Failed to resend OTP';
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.isResendingOtp = false;
          console.log('Resend OTP Error:', error);
          this.otpError = 'Failed to resend OTP. Please try again.';
          this.cdr.detectChanges();
        },
      });
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');

    if (!value) {
      this.otpForm.get(`otp${index}`)?.setValue('');
      return;
    }

    const digit = value.charAt(value.length - 1);
    this.otpForm.get(`otp${index}`)?.setValue(digit);

    if (index < 5) {
      this.focusOtpInput(index + 1);
    }

    this.tryAutoSubmitOtp();
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (input.value) {
        this.otpForm.get(`otp${index}`)?.setValue('');
        input.value = '';
      } else if (index > 0) {
        this.focusOtpInput(index - 1);
        this.otpForm.get(`otp${index - 1}`)?.setValue('');
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusOtpInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      this.focusOtpInput(index + 1);
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (!digits.length) return;

    digits.forEach((digit, index) => {
      this.otpForm.get(`otp${index}`)?.setValue(digit);
    });

    const focusIndex = digits.length >= 6 ? 5 : digits.length;
    this.focusOtpInput(focusIndex > 5 ? 5 : focusIndex);

    this.tryAutoSubmitOtp();
  }

  private tryAutoSubmitOtp(): void {
    const isComplete = this.otpControls.every((key) => {
      const value = this.otpForm.get(key)?.value;
      return /^\d$/.test(value);
    });

    if (isComplete) {
      setTimeout(() => {
        this.submitOtp();
      }, 150);
    }
  }

  private resetOtpForm(): void {
    this.otpForm.reset({
      otp0: '',
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      otp5: '',
    });
  }

  private focusOtpInput(index: number): void {
    const inputs = this.otpInputs?.toArray();
    if (inputs?.[index]) {
      inputs[index].nativeElement.focus();
      inputs[index].nativeElement.select();
    }
  }

  private startOtpTimer(): void {
    this.stopOtpTimer();
    this.otpTimer = 300;
    this.cdr.detectChanges();

    this.otpInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
        this.cdr.detectChanges();
      } else {
        this.stopOtpTimer();
      }
    }, 1000);
  }

  private handleApiError(error: any): void {
    console.log('API Error:', error);
    console.log('Error type:', typeof error);
    console.log('Error.errors:', error.errors);
    console.log('Error.message:', error.message);
    
    // Clear previous server errors
    this.serverErrors = {};
    
    // Check if errors is an object with field-specific errors
    if (error.errors && typeof error.errors === 'object' && !Array.isArray(error.errors) && Object.keys(error.errors).length > 0) {
      // Map server error field names to form control names
      const fieldMapping: { [key: string]: string } = {
        'Email': 'email',
        'Password': 'password',
        'MobileNumber': 'mobileNumber',
        'CompanyWebsite': 'companyWebsite',
        'BusinessName': 'businessName'
      };
      
      for (const key in error.errors) {
        if (error.errors[key] && error.errors[key].length > 0) {
          const formControlName = fieldMapping[key] || key.toLowerCase();
          this.serverErrors[formControlName] = error.errors[key][0];
          
          // Set error on the form control to highlight the field
          const control = this.registerForm.get(formControlName);
          if (control) {
            control.setErrors({ serverError: true });
            control.markAsTouched();
          }
        }
      }
      this.apiError = 'Please fix the errors below and try again.';
      console.log('Set serverErrors:', this.serverErrors);
    } else if (error.message) {
      this.apiError = error.message;
      console.log('Set apiError from message:', this.apiError);
    } else {
      this.apiError = 'An error occurred during registration. Please try again.';
      console.log('Set default apiError:', this.apiError);
    }
    
    this.cdr.detectChanges();
  }
  
  clearServerError(fieldName: string): void {
    if (this.serverErrors[fieldName]) {
      delete this.serverErrors[fieldName];
      const control = this.registerForm.get(fieldName);
      if (control && control.hasError('serverError')) {
        control.updateValueAndValidity();
      }
      this.cdr.detectChanges();
    }
  }

  private stopOtpTimer(): void {
    if (this.otpInterval) {
      clearInterval(this.otpInterval);
      this.otpInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopOtpTimer();
  }

  passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';

    const isValid =
      value.length >= 8 &&
      /[A-Z]/.test(value) &&
      /[a-z]/.test(value) &&
      /[0-9]/.test(value) &&
      /[^A-Za-z0-9]/.test(value);

    return isValid ? null : { weakPassword: true };
  }
}
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
import { PhoneCkycService } from '../../services/phone-ckyc/phone-ckyc.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-phone-ckyc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent],
  templateUrl: './phone-ckyc.html',
  styleUrl: './phone-ckyc.scss',
})
export class PhoneCkycComponent implements OnInit, OnDestroy {
  ckycForm: FormGroup;

  otpVisible = false;
  otpSent = false;
  timer = 30;
  canResendOtp = false;
  showSkipPopup = false;

  isMobileEditable = false;
  loading = false;
  sendingOtp = false;
  verifyingOtp = false;
  saving = false;

  otpDigits: string[] = ['', '', '', '', '', ''];

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private phoneCkycService: PhoneCkycService,
    private authService: AuthService
  ) {
    this.ckycForm = this.fb.group({
      mobileNumber: ['9907866754', [Validators.required, this.mobileValidator]],
      otp: [
        { value: '', disabled: true },
        [Validators.required, Validators.pattern(/^[0-9]{6}$/)],
      ],
      consent: [true, Validators.requiredTrue],
    });

    this.ckycForm.get('mobileNumber')?.markAsTouched();
  }

  ngOnInit(): void {
    this.loadExistingPhoneCkyc();
  }

  loadExistingPhoneCkyc(): void {
    this.loading = true;
    this.phoneCkycService.getPhoneCkyc().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const mobileNumber = response.data.mobileNumber.replace('+91', '');
          this.ckycForm.patchValue({
            mobileNumber: mobileNumber,
            consent: response.data.consentGiven,
          });
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        // 404 is expected if phone CKYC not set yet
        if (err.status === 404) {
          console.log('No existing phone CKYC found (404)');
        } else {
          console.error('Error loading phone CKYC:', err);
        }
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  get f() {
    return this.ckycForm.controls;
  }

  get isOtpComplete(): boolean {
    return this.otpDigits.join('').length === 6;
  }

  get actionButtonLabel(): string {
    return this.otpVisible && this.isOtpComplete
      ? 'Verify and Proceed →'
      : 'Proceed with CKYC →';
  }

  mobileValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').toString().replace(/\D/g, '');

    if (!value) {
      return { required: true };
    }

    return /^[6-9][0-9]{9}$/.test(value) ? null : { invalidMobile: true };
  }

  onMobileInput(): void {
    if (!this.isMobileEditable) {
      return;
    }

    const mobileControl = this.ckycForm.get('mobileNumber');
    const rawValue = mobileControl?.value || '';
    const digitsOnly = rawValue.toString().replace(/\D/g, '').slice(0, 10);

    if (rawValue !== digitsOnly) {
      mobileControl?.setValue(digitsOnly, { emitEvent: false });
    }

    mobileControl?.markAsTouched();
    mobileControl?.updateValueAndValidity();

    if (digitsOnly.length < 10) {
      this.resetOtpState();
    }
  }

  enableEdit(): void {
    this.isMobileEditable = true;

    const mobileControl = this.ckycForm.get('mobileNumber');
    mobileControl?.markAsTouched();
    mobileControl?.updateValueAndValidity();

    setTimeout(() => {
      const input = document.getElementById('mobileNumber') as HTMLInputElement | null;
      if (input) {
        input.removeAttribute('readonly');
        input.focus();
        const valueLength = input.value.length;
        input.setSelectionRange(valueLength, valueLength);
      }
    }, 0);
  }

  onProceedClick(): void {
    const mobileControl = this.ckycForm.get('mobileNumber');
    const consentControl = this.ckycForm.get('consent');

    mobileControl?.markAsTouched();
    consentControl?.markAsTouched();
    mobileControl?.updateValueAndValidity();

    if (mobileControl?.invalid || consentControl?.invalid) {
      return;
    }

    if (!this.otpVisible) {
      this.sendOtp();
      return;
    }

    this.ckycForm.get('otp')?.markAsTouched();

    if (!this.isOtpComplete) {
      return;
    }

    this.verifyOtpAndProceed();
  }

  sendOtp(): void {
    const mobileControl = this.ckycForm.get('mobileNumber');

    mobileControl?.markAsTouched();
    mobileControl?.updateValueAndValidity();

    if (mobileControl?.invalid) {
      return;
    }

    this.sendingOtp = true;
    this.phoneCkycService.sendOtp().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.otpVisible = true;
          this.otpSent = true;
          this.canResendOtp = false;

          this.resetOtpBoxes();
          this.ckycForm.get('otp')?.enable();
          this.ckycForm.get('otp')?.setValue('');
          this.ckycForm.get('otp')?.markAsUntouched();

          // Use remaining seconds from API response
          this.timer = response.data.remainingSeconds || 30;
          this.startTimer();

          setTimeout(() => {
            const firstOtpInput = document.getElementById('otp-0') as HTMLInputElement | null;
            firstOtpInput?.focus();
          }, 0);
        }
        this.sendingOtp = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error sending OTP:', err);
        this.sendingOtp = false;
        this.cdr.markForCheck();
      }
    });
  }

  onOtpDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 1);

    this.otpDigits[index] = value;
    input.value = value;

    this.updateOtpFormValue();

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (!input.value && index > 0) {
        this.otpDigits[index] = '';
        this.updateOtpFormValue();

        const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
        prevInput?.focus();
      } else {
        this.otpDigits[index] = '';
        this.updateOtpFormValue();
      }
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    }

    if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (!digits.length) {
      return;
    }

    this.resetOtpBoxes();

    digits.forEach((digit, index) => {
      this.otpDigits[index] = digit;
      const input = document.getElementById(`otp-${index}`) as HTMLInputElement | null;
      if (input) {
        input.value = digit;
      }
    });

    this.updateOtpFormValue();

    if (digits.length < 6) {
      const nextInput = document.getElementById(`otp-${digits.length}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  }

  updateOtpFormValue(): void {
    const otpValue = this.otpDigits.join('');
    const otpControl = this.ckycForm.get('otp');

    otpControl?.setValue(otpValue, { emitEvent: false });
    otpControl?.markAsTouched();
    otpControl?.updateValueAndValidity();
  }

  resetOtpBoxes(): void {
    this.otpDigits = ['', '', '', '', '', ''];

    for (let i = 0; i < 6; i++) {
      const input = document.getElementById(`otp-${i}`) as HTMLInputElement | null;
      if (input) {
        input.value = '';
      }
    }
  }

  resendOtp(): void {
    if (!this.canResendOtp || this.sendingOtp) {
      return;
    }

    this.sendOtp();
  }

  startTimer(): void {
    this.clearTimer();
    // Don't reset timer here - it's set from API response in sendOtp()
    // Default to 30 only if not already set
    if (this.timer === 0 || this.timer === 30) {
      this.timer = 30;
    }
    this.canResendOtp = false;
    this.cdr.detectChanges();

    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.cdr.detectChanges();
      }

      if (this.timer === 0) {
        this.canResendOtp = true;
        this.clearTimer();
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetOtpState(): void {
    this.otpVisible = false;
    this.otpSent = false;
    this.canResendOtp = false;
    this.timer = 30;
    this.clearTimer();

    this.resetOtpBoxes();
    this.ckycForm.get('otp')?.reset();
    this.ckycForm.get('otp')?.disable();
  }

  verifyOtpAndProceed(): void {
    this.ckycForm.markAllAsTouched();

    if (this.ckycForm.invalid || !this.isOtpComplete) {
      return;
    }

    this.verifyingOtp = true;
    const mobileNumber = this.ckycForm.get('mobileNumber')?.value || '';
    const otp = this.otpDigits.join('');

    this.phoneCkycService.verifyOtp({ mobileNumber, otp }).subscribe({
      next: (response) => {
        if (response.success && response.data?.isVerified) {
          // OTP verified successfully, now save CKYC details
          this.savePhoneCkyc();
        } else {
          // OTP verification failed
          console.error('OTP verification failed:', response.message);
          this.verifyingOtp = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Error verifying OTP:', err);
        this.verifyingOtp = false;
        this.cdr.markForCheck();
      }
    });
  }

  savePhoneCkyc(): void {
    this.saving = true;
    const consentControl = this.ckycForm.get('consent');

    this.phoneCkycService.savePhoneCkyc({
      ckycIdentifier: '',
      consentGiven: consentControl?.value || false,
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Update auth service with new onboarding status
          this.authService.setAuthData(
            this.authService.getToken() || '',
            this.authService.getUserId() || '',
            this.authService.getMid() || '',
            this.authService.getUserData(),
            this.authService.getRefreshToken() || undefined,
            this.authService.getTokenExpiration() || undefined,
            this.authService.getRefreshTokenExpiration() || undefined,
            response.data.onboardingStatus
          );
          console.log('Onboarding status updated');
          this.router.navigate(['/business-category']);
        }
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error saving phone CKYC:', err);
        this.verifyingOtp = false;
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/business-entity']);
  }

  openSkipPopup(): void {
    this.showSkipPopup = true;
  }

  confirmSkip(): void {
    this.showSkipPopup = false;
    // Skip by saving with empty ckycIdentifier
    this.saving = true;
    const consentControl = this.ckycForm.get('consent');

    this.phoneCkycService.savePhoneCkyc({
      ckycIdentifier: '',
      consentGiven: consentControl?.value || false,
    }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Update auth service with new onboarding status
          this.authService.setAuthData(
            this.authService.getToken() || '',
            this.authService.getUserId() || '',
            this.authService.getMid() || '',
            this.authService.getUserData(),
            this.authService.getRefreshToken() || undefined,
            this.authService.getTokenExpiration() || undefined,
            this.authService.getRefreshTokenExpiration() || undefined,
            response.data.onboardingStatus
          );
          console.log('Onboarding status updated');
          this.router.navigate(['/business-category']);
        }
        this.saving = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error saving phone CKYC on skip:', err);
        this.saving = false;
        this.cdr.markForCheck();
      }
    });
  }

  closeSkipPopup(): void {
    this.showSkipPopup = false;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
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
  selector: 'app-phone-ckyc',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent],
  templateUrl: './phone-ckyc.html',
  styleUrl: './phone-ckyc.scss',
})
export class PhoneCkycComponent implements OnDestroy {
  ckycForm: FormGroup;

  otpVisible = false;
  otpSent = false;
  timer = 30;
  canResendOtp = false;
  showSkipPopup = false;

  isMobileEditable = false;

  otpDigits: string[] = ['', '', '', '', '', ''];

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
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

    this.otpVisible = true;
    this.otpSent = true;
    this.canResendOtp = false;

    this.resetOtpBoxes();
    this.ckycForm.get('otp')?.enable();
    this.ckycForm.get('otp')?.setValue('');
    this.ckycForm.get('otp')?.markAsUntouched();

    this.startTimer();

    setTimeout(() => {
      const firstOtpInput = document.getElementById('otp-0') as HTMLInputElement | null;
      firstOtpInput?.focus();
    }, 0);
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
    if (!this.canResendOtp) {
      return;
    }

    this.sendOtp();
  }

  startTimer(): void {
    this.clearTimer();
    this.timer = 30;
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

    this.router.navigate(['/business-category']);
  }

  goBack(): void {
    this.router.navigate(['/business-entity']);
  }

  openSkipPopup(): void {
    this.showSkipPopup = true;
  }

  confirmSkip(): void {
    this.showSkipPopup = false;
    this.router.navigate(['/business-category']);
  }

  closeSkipPopup(): void {
    this.showSkipPopup = false;
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  constructor(private fb: FormBuilder) {
    this.ckycForm = this.fb.group({
      mobileNumber: ['', [Validators.required, this.mobileValidator]],
      otp: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      consent: [true, Validators.requiredTrue],
    });
  }

  get f() {
    return this.ckycForm.controls;
  }

  mobileValidator(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').toString().replace(/\D/g, '');
    if (!value) return null;
    return /^[6-9][0-9]{9}$/.test(value) ? null : { invalidMobile: true };
  }

  onMobileInput(): void {
    const mobileControl = this.ckycForm.get('mobileNumber');
    const rawValue = mobileControl?.value || '';
    const digitsOnly = rawValue.toString().replace(/\D/g, '').slice(0, 10);

    if (rawValue !== digitsOnly) {
      mobileControl?.setValue(digitsOnly, { emitEvent: false });
    }

    if (digitsOnly.length < 10) {
      this.resetOtpState();
      return;
    }

    if (digitsOnly.length === 10 && mobileControl?.valid && !this.otpSent) {
      this.sendOtp();
    }
  }

  sendOtp(): void {
    const mobileControl = this.ckycForm.get('mobileNumber');

    if (mobileControl?.invalid) {
      mobileControl.markAsTouched();
      return;
    }

    this.otpVisible = true;
    this.otpSent = true;
    this.canResendOtp = false;

    this.ckycForm.get('otp')?.enable();
    this.ckycForm.get('otp')?.reset();

    this.startTimer();
  }

  onOtpInput(): void {
    const otpControl = this.ckycForm.get('otp');
    const rawValue = otpControl?.value || '';
    const digitsOnly = rawValue.toString().replace(/\D/g, '').slice(0, 6);

    if (rawValue !== digitsOnly) {
      otpControl?.setValue(digitsOnly, { emitEvent: false });
    }
  }

  resendOtp(): void {
    if (!this.canResendOtp) return;
    this.sendOtp();
  }

  startTimer(): void {
    this.clearTimer();
    this.timer = 30;

    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      }

      if (this.timer === 0) {
        this.canResendOtp = true;
        this.clearTimer();
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
    this.ckycForm.get('otp')?.reset();
    this.ckycForm.get('otp')?.disable();
  }

  onSubmit(): void {
    if (this.ckycForm.invalid) {
      this.ckycForm.markAllAsTouched();
      return;
    }

    console.log('CKYC Form Submitted:', this.ckycForm.getRawValue());
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}
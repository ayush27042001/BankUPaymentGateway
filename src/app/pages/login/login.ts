import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  isPasswordVisible = false;
  isSubmitting = false;

  showOtpLogin = false;
  otpSent = false;

  otpDigits: string[] = ['', '', '', ''];
  otpTimer = 57;
  canResendOtp = false;
  private otpInterval: ReturnType<typeof setInterval> | null = null;

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  otpLoginForm: FormGroup = this.fb.group({
    mobileNumber: [
      '',
      [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)],
    ],
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get mobileNumber() {
    return this.otpLoginForm.get('mobileNumber');
  }

  get isOtpComplete(): boolean {
    return this.otpDigits.join('').length === 4;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.router.navigate(['/pan-verification']);
  }

  openOtpLogin(): void {
    this.showOtpLogin = true;
    this.otpLoginForm.reset();
    this.resetOtpState();
  }

  goBackToLogin(): void {
    this.showOtpLogin = false;
    this.otpLoginForm.reset();
    this.resetOtpState();
  }

  sendOtp(): void {
    if (this.otpLoginForm.invalid) {
      this.otpLoginForm.markAllAsTouched();
      return;
    }

    this.otpSent = true;
    this.resetOtpInputs();
    this.startOtpTimer();

    setTimeout(() => {
      this.focusOtpInput(0);
    }, 0);
  }

  resendOtp(): void {
    if (!this.canResendOtp) {
      return;
    }

    this.resetOtpInputs();
    this.startOtpTimer();

    setTimeout(() => {
      this.focusOtpInput(0);
    }, 0);
  }

  verifyOtp(): void {
    if (!this.isOtpComplete) {
      return;
    }

    const otpValue = this.otpDigits.join('');

    if (otpValue.length !== 4) {
      return;
    }

    this.router.navigate(['/pan-verification']);
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 1);

    this.otpDigits[index] = value;
    this.otpDigits = [...this.otpDigits];
    input.value = value;

    if (value && index < this.otpDigits.length - 1) {
      this.focusOtpInput(index + 1);
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      if (input.value) {
        this.otpDigits[index] = '';
        this.otpDigits = [...this.otpDigits];
        input.value = '';
        return;
      }

      if (index > 0) {
        this.otpDigits[index] = '';
        this.otpDigits = [...this.otpDigits];
        this.focusOtpInput(index - 1);
      }

      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusOtpInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < this.otpDigits.length - 1) {
      event.preventDefault();
      this.focusOtpInput(index + 1);
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedValue = event.clipboardData?.getData('text') ?? '';
    const digits = pastedValue.replace(/\D/g, '').slice(0, 4).split('');

    if (!digits.length) {
      return;
    }

    this.otpDigits = ['', '', '', ''];

    for (let i = 0; i < 4; i++) {
      this.otpDigits[i] = digits[i] ?? '';
    }

    this.otpDigits = [...this.otpDigits];

    const focusIndex = Math.min(digits.length, 4) - 1;
    this.focusOtpInput(focusIndex >= 0 ? focusIndex : 0);
  }

  formatTimer(value: number): string {
    return `00:${value.toString().padStart(2, '0')}`;
  }

  private focusOtpInput(index: number): void {
    const targetInput = document.getElementById(`otp-${index}`) as HTMLInputElement | null;
    targetInput?.focus();
    targetInput?.select();
  }

  private startOtpTimer(): void {
    this.clearOtpTimer();
    this.otpTimer = 57;
    this.canResendOtp = false;

    this.otpInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        this.canResendOtp = true;
        this.clearOtpTimer();
      }
    }, 1000);
  }

  private resetOtpInputs(): void {
    this.otpDigits = ['', '', '', ''];
  }

  private resetOtpState(): void {
    this.otpSent = false;
    this.canResendOtp = false;
    this.otpTimer = 57;
    this.resetOtpInputs();
    this.clearOtpTimer();
  }

  private clearOtpTimer(): void {
    if (this.otpInterval) {
      clearInterval(this.otpInterval);
      this.otpInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.clearOtpTimer();
  }
}

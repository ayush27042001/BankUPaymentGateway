import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../components/loader/loader';
import {
  SuperAdminAuthService,
} from '../../services/superadmin-auth.service';

type LoginStep = 'credentials' | 'otp';

@Component({
  selector: 'app-superadmin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './superadmin-login.html',
  styleUrl: './superadmin-login.scss',
})
export class SuperAdminLoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private superAdminAuthService = inject(SuperAdminAuthService);
  private cdr = inject(ChangeDetectorRef);

  loginStep: LoginStep = 'credentials';

  isPasswordVisible = false;
  isSubmitting = false;
  isVerifyingOtp = false;
  loginError: string | null = null;
  otpError: string | null = null;

  otpDigits: string[] = ['', '', '', '', '', ''];
  otpTimer = 120;
  canResendOtp = false;
  isResendingOtp = false;
  private otpInterval: ReturnType<typeof setInterval> | null = null;

  credentialsForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get username() {
    return this.credentialsForm.get('username');
  }

  get password() {
    return this.credentialsForm.get('password');
  }

  get isOtpComplete(): boolean {
    return this.otpDigits.join('').length === 6;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.credentialsForm.invalid) {
      this.credentialsForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginError = null;
    this.cdr.detectChanges();

    this.superAdminAuthService
      .superAdminLogin({
        username: this.credentialsForm.value.username,
        password: this.credentialsForm.value.password,
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.cdr.detectChanges();

          if (response.success) {
            this.loginStep = 'otp';
            this.resetOtpInputs();
            this.startOtpTimer(120);
            this.cdr.detectChanges();
            setTimeout(() => this.focusOtpInput(0), 0);
          } else {
            this.loginError = response.message || 'Authentication failed. Please check your credentials.';
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
          this.loginError =
            error.error?.message || 'Invalid username or password.';
          this.cdr.detectChanges();
        },
      });
  }

  verifyOtp(): void {
    if (!this.isOtpComplete) return;

    const otpValue = this.otpDigits.join('');
    if (otpValue.length !== 6) return;

    this.isVerifyingOtp = true;
    this.otpError = null;
    this.cdr.detectChanges();

    this.superAdminAuthService
      .verifyAdminOtp({
        username: this.credentialsForm.value.username,
        otp: otpValue,
      })
      .subscribe({
        next: (response) => {
          this.isVerifyingOtp = false;
          this.cdr.detectChanges();

          if (response.success) {
            if (response.data?.token) {
              localStorage.setItem('adminToken', response.data.token);
              if (response.data.refreshToken) {
                localStorage.setItem('adminRefreshToken', response.data.refreshToken);
              }
              if (response.data.username) {
                localStorage.setItem('adminUsername', response.data.username);
              }
            }
            this.clearOtpTimer();
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.otpError = response.message || 'Invalid or expired OTP.';
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.isVerifyingOtp = false;
          this.cdr.detectChanges();
          this.otpError =
            error.error?.message || 'Invalid or expired OTP.';
          this.cdr.detectChanges();
        },
      });
  }

  resendOtp(): void {
    if (!this.canResendOtp || this.isResendingOtp) return;

    this.isResendingOtp = true;
    this.otpError = null;
    this.cdr.detectChanges();

    this.superAdminAuthService
      .superAdminLogin({
        username: this.credentialsForm.value.username,
        password: this.credentialsForm.value.password,
      })
      .subscribe({
        next: (response) => {
          this.isResendingOtp = false;

          if (response.success) {
            this.resetOtpInputs();
            this.startOtpTimer(120);
            this.cdr.detectChanges();
            setTimeout(() => this.focusOtpInput(0), 0);
          } else {
            this.otpError = response.message || 'Failed to resend OTP.';
            this.cdr.detectChanges();
          }
        },
        error: (error) => {
          this.isResendingOtp = false;
          this.cdr.detectChanges();
          this.otpError = error.error?.message || 'Failed to resend OTP.';
          this.cdr.detectChanges();
        },
      });
  }

  goBackToCredentials(): void {
    this.loginStep = 'credentials';
    this.resetOtpInputs();
    this.otpError = null;
    this.clearOtpTimer();
    this.cdr.detectChanges();
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value.length > 1) {
      value = value.slice(-1);
    }

    value = value.replace(/\D/g, '');
    this.otpDigits[index] = value;
    this.otpDigits = [...this.otpDigits];

    if (value && index < this.otpDigits.length - 1) {
      setTimeout(() => this.focusOtpInput(index + 1), 0);
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
    const digits = pastedValue.replace(/\D/g, '').slice(0, 6).split('');

    if (!digits.length) return;

    this.otpDigits = ['', '', '', '', '', ''];
    for (let i = 0; i < 6; i++) {
      this.otpDigits[i] = digits[i] ?? '';
    }
    this.otpDigits = [...this.otpDigits];

    const focusIndex = Math.min(digits.length, 6) - 1;
    this.focusOtpInput(focusIndex >= 0 ? focusIndex : 0);
  }

  formatTimer(value: number): string {
    const minutes = Math.floor(value / 60);
    const seconds = value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private focusOtpInput(index: number): void {
    const target = document.getElementById(`sa-otp-${index}`) as HTMLInputElement | null;
    target?.focus();
    target?.select();
  }

  private startOtpTimer(seconds = 120): void {
    this.clearOtpTimer();
    this.otpTimer = seconds;
    this.canResendOtp = false;
    this.cdr.detectChanges();

    this.otpInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
        this.cdr.detectChanges();
      } else {
        this.canResendOtp = true;
        this.clearOtpTimer();
        this.cdr.detectChanges();
      }
    }, 1000);
  }

  private resetOtpInputs(): void {
    this.otpDigits = ['', '', '', '', '', ''];
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

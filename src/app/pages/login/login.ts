import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { AuthService } from '../../services/auth/auth.service';
import { LoaderComponent } from '../../components/loader/loader';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoaderComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  isPasswordVisible = false;
  isSubmitting = false;
  loginError: string | null = null;

  showOtpLogin = false;
  otpSent = false;
  isSendingOtp = false;
  isVerifyingOtp = false;
  otpError: string | null = null;

  otpDigits: string[] = ['', '', '', '', '', ''];
  otpTimer = 300;
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
    return this.otpDigits.join('').length === 6;
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.loginError = null;
    this.cdr.detectChanges();

    this.loginService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        console.log('Login Response:', response);

        if (response.success) {
          this.authService.setAuthData(
            response.data.token,
            response.data.email,
            response.data.mobileNumber,
            {
              userName: response.data.firstName,
              email: response.data.email,
            },
            response.data.refreshToken,
            response.data.expiration,
            response.data.refreshTokenExpiration,
            response.data.onboardingStatus
          );
          const redirectRoute = this.authService.getActiveRouteBasedOnOnboarding();
          this.router.navigate([redirectRoute]);
        } else {
          this.loginError = response.message || 'Login failed';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.cdr.detectChanges();
        console.log('Login Error:', error);
        const errorMessage = error.error?.message || 'Invalid email or password';
        this.loginError = errorMessage;
        this.cdr.detectChanges();
      },
    });
  }

  openOtpLogin(): void {
    this.showOtpLogin = true;
    this.otpLoginForm.reset();
    this.resetOtpState();
    this.otpError = null;
  }

  goBackToLogin(): void {
    this.showOtpLogin = false;
    this.otpLoginForm.reset();
    this.resetOtpState();
    this.otpError = null;
  }

  sendOtp(): void {
    if (this.otpLoginForm.invalid) {
      this.otpLoginForm.markAllAsTouched();
      return;
    }

    this.isSendingOtp = true;
    this.otpError = null;
    this.cdr.detectChanges();

    this.loginService.sendOtp({
      mobileNumber: this.otpLoginForm.value.mobileNumber,
      purpose: 'Login',
    }).subscribe({
      next: (response) => {
        this.isSendingOtp = false;

        if (response.success) {
          this.otpSent = true;
          this.resetOtpInputs();
          this.startOtpTimer(response.data.remainingSeconds);
          this.cdr.detectChanges();

          setTimeout(() => {
            this.focusOtpInput(0);
          }, 0);
        } else {
          this.otpError = response.message || 'Failed to send OTP';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isSendingOtp = false;
        this.cdr.detectChanges();
        const errorMessage = error.error?.message || error.message || 'Failed to send OTP';
        this.otpError = errorMessage;
        this.cdr.detectChanges();
      },
    });
  }

  resendOtp(): void {
    if (!this.canResendOtp || this.otpLoginForm.invalid) {
      return;
    }

    this.isSendingOtp = true;
    this.otpError = null;
    this.cdr.detectChanges();

    this.loginService.sendOtp({
      mobileNumber: this.otpLoginForm.value.mobileNumber,
      purpose: 'Login',
    }).subscribe({
      next: (response) => {
        this.isSendingOtp = false;
        console.log('Resend OTP Response:', response);

        if (response.success) {
          this.resetOtpInputs();
          this.startOtpTimer(response.data.remainingSeconds);
          this.cdr.detectChanges();

          setTimeout(() => {
            this.focusOtpInput(0);
          }, 0);
        } else {
          this.otpError = response.message || 'Failed to resend OTP';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isSendingOtp = false;
        console.log('Resend OTP Error:', error);
        const errorMessage = error.error?.message || 'Failed to resend OTP';
        this.otpError = errorMessage;
        this.cdr.detectChanges();
      },
    });
  }

  verifyOtp(): void {
    if (!this.isOtpComplete) {
      return;
    }

    const otpValue = this.otpDigits.join('');

    if (otpValue.length !== 6) {
      return;
    }

    this.isVerifyingOtp = true;
    this.otpError = null;
    this.cdr.detectChanges();

    this.loginService.verifyOtp({
      mobileNumber: this.otpLoginForm.value.mobileNumber,
      otp: otpValue,
    }).subscribe({
      next: (response) => {
        this.isVerifyingOtp = false;
        console.log('Verify OTP Response:', response);

        if (response.success) {
          this.authService.setAuthData(
            response.data.token,
            response.data.email,
            response.data.mobileNumber,
            {
              userName: response.data.firstName,
              email: response.data.email,
            },
            response.data.refreshToken,
            response.data.expiration,
            response.data.refreshTokenExpiration,
            response.data.onboardingStatus
          );
          const redirectRoute = this.authService.getActiveRouteBasedOnOnboarding();
          this.router.navigate([redirectRoute]);
        } else {
          this.otpError = response.message || 'Invalid or expired OTP';
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        this.isVerifyingOtp = false;
        console.log('Verify OTP Error:', error);
        const errorMessage = error.error?.message || 'Invalid or expired OTP';
        this.otpError = errorMessage;
        this.cdr.detectChanges();
      },
    });
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Take only the last character entered (handles mobile double-entry)
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Remove non-digits
    value = value.replace(/\D/g, '');

    // Update the array (this updates the input via [value] binding)
    this.otpDigits[index] = value;
    this.otpDigits = [...this.otpDigits];

    // Move to next input if a digit was entered
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

    if (!digits.length) {
      return;
    }

    this.otpDigits = ['', '', '', '', '', ''];

    for (let i = 0; i < 6; i++) {
      this.otpDigits[i] = digits[i] ?? '';
    }

    this.otpDigits = [...this.otpDigits];

    const focusIndex = Math.min(digits.length, 6) - 1;
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

  private startOtpTimer(seconds: number = 300): void {
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
        this.cdr.detectChanges();
        this.clearOtpTimer();
      }
    }, 1000);
  }

  private resetOtpInputs(): void {
    this.otpDigits = ['', '', '', '', '', ''];
  }

  private resetOtpState(): void {
    this.otpSent = false;
    this.canResendOtp = false;
    this.otpTimer = 300;
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

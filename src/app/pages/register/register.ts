import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, QueryList, ViewChildren, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class RegisterComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  isPasswordVisible = false;
  showOtpModal = false;
  otpTimer = 30;
  private otpInterval: ReturnType<typeof setInterval> | null = null;

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
  });

  otpForm: FormGroup = this.fb.group({
    otp0: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
    otp5: ['', [Validators.required, Validators.pattern(/^\d$/)]],
  });

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

    this.showOtpModal = true;
    this.resetOtpForm();
    this.startOtpTimer();

    setTimeout(() => {
      this.focusOtpInput(0);
    }, 50);
  }

  closeOtpModal(): void {
    this.showOtpModal = false;
    this.stopOtpTimer();
    this.resetOtpForm();
  }

  submitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const finalOtp = this.otpControls
      .map((key) => this.otpForm.get(key)?.value || '')
      .join('');

    console.log('Register Data:', this.registerForm.value);
    console.log('OTP Data:', finalOtp);

    this.stopOtpTimer();
    this.showOtpModal = false;
    this.router.navigate(['/pan-verification']);
  }

  resendOtp(): void {
    if (this.otpTimer > 0) return;

    this.resetOtpForm();
    this.startOtpTimer();

    setTimeout(() => {
      this.focusOtpInput(0);
    }, 50);
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
    this.otpTimer = 30;

    this.otpInterval = setInterval(() => {
      if (this.otpTimer > 0) {
        this.otpTimer--;
      } else {
        this.stopOtpTimer();
      }
    }, 1000);
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
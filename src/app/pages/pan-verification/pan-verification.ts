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
  selector: 'app-pan-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent],
  templateUrl: './pan-verification.html',
  styleUrl: './pan-verification.scss',
})
export class PanVerificationComponent {
  panForm: FormGroup;
  maxDobDate: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
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
        fullNameControl?.reset();
        dobControl?.reset();
        fullNameControl?.disable();
        dobControl?.disable();
        return;
      }

      const upperValue = value.toUpperCase();
      if (value !== upperValue) {
        panControl?.setValue(upperValue, { emitEvent: false });
      }

      if (panControl?.valid) {
        fullNameControl?.enable();
        dobControl?.enable();
      } else {
        fullNameControl?.reset();
        dobControl?.reset();
        fullNameControl?.disable();
        dobControl?.disable();
      }
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

    this.router.navigate(['/business-entity']);
  }
}
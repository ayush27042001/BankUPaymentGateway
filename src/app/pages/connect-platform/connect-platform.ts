import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
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

type StepKey =
  | 'platform'
  | 'bank-details'
  | 'signing-authority'
  | 'business-address'
  | 'video-kyc'
  | 'thank-you';

type SectionKey = 'business' | 'kyc' | 'documents' | 'agreement';

@Component({
  selector: 'app-connect-platform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OnboardingHeaderComponent,NgSelectModule],
  templateUrl: './connect-platform.html',
  styleUrl: './connect-platform.scss',
})
export class ConnectPlatformComponent implements OnInit, OnDestroy {
  currentStep: StepKey = 'platform';

  platformForm!: FormGroup;
  bankForm!: FormGroup;
  signingAuthorityForm!: FormGroup;
  businessAddressForm!: FormGroup;
  uploadDocumentsForm!: FormGroup;

   imageUrl = '../../../assets/images/website-illustration.png';

  holderNames: string[] = ['AYUSH KUMAR AWASTHI', 'RISHABH PAL', 'BUSINESS NAME'];

  // Controls the bank confirmation modal visibility
  showBankConfirmModal = false;

  // Controls the upload documents modal visibility
  showUploadDocumentsModal = false;

  matchedBankName = 'BANK OF INDIA | SITAPUR';
  maskedAccountNumber = '';

  selectedDocumentNames = {
    aadhaarCard: '',
    panCard: '',
    photoFile: '',
    businessProofFile: '',
    shopFrontPhoto: '',
    shopInsidePhoto: '',
    applicationFormFile: '',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.setupCollectionModeWatcher();
    this.applyPlatformValidators(this.platformForm.get('collectionMode')?.value);
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }

  initializeForms(): void {
    this.platformForm = this.fb.group({
      collectionMode: ['website-app', Validators.required],
      websiteUrl: ['https://', [Validators.required, this.urlValidator.bind(this)]],
      androidAppUrl: ['', [this.optionalUrlValidator.bind(this)]],
      iosAppUrl: ['', [this.optionalUrlValidator.bind(this)]],
    });

    this.bankForm = this.fb.group({
      bankHolderName: ['', Validators.required],
      bankAccountNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)],
      ],
      ifscCode: ['', [Validators.required, this.ifscValidator.bind(this)]],
    });

    this.signingAuthorityForm = this.fb.group({
      signingAuthorityName: ['AYUSH KUMAR AWASTHI', Validators.required],
      signingAuthorityEmail: ['', [Validators.required, Validators.email]],
      signingAuthorityPan: [
        'CMHPA4444B',
        [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
      ],
      pepStatus: ['not-applicable', Validators.required],
    });

    this.businessAddressForm = this.fb.group({
      address: ['BAMBHAURA SITAPUR SITAPUR, ...', Validators.required],
      postalCode: ['261141', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      state: ['UTTAR PRADESH', Validators.required],
      city: ['Sitapur', Validators.required],
      hasDifferentAddress: ['no', Validators.required],
    });

    this.uploadDocumentsForm = this.fb.group({
      aadhaarCard: [null, Validators.required],
      panCard: [null, Validators.required],
      photoFile: [null, Validators.required],
      businessProofType: ['', Validators.required],
      businessProofFile: [null, Validators.required],
      shopFrontPhoto: [null, Validators.required],
      shopInsidePhoto: [null, Validators.required],
      applicationFormFile: [null, Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.platformForm.controls;
  }

  get bankControls(): { [key: string]: AbstractControl } {
    return this.bankForm.controls;
  }

  get signingControls(): { [key: string]: AbstractControl } {
    return this.signingAuthorityForm.controls;
  }

  get addressControls(): { [key: string]: AbstractControl } {
    return this.businessAddressForm.controls;
  }

  get uploadControls(): { [key: string]: AbstractControl } {
    return this.uploadDocumentsForm.controls;
  }

  get currentSection(): SectionKey {
    if (this.currentStep === 'platform' || this.currentStep === 'bank-details') {
      return 'business';
    }

    if (
      this.currentStep === 'signing-authority' ||
      this.currentStep === 'business-address'
    ) {
      return 'kyc';
    }

    if (this.currentStep === 'video-kyc' || this.currentStep === 'thank-you') {
      return 'documents';
    }

    return 'agreement';
  }

    // Watches the collection mode and updates validators dynamically
  private setupCollectionModeWatcher(): void {
    this.platformForm.get('collectionMode')?.valueChanges.subscribe((mode) => {
      this.applyPlatformValidators(mode);
    });
  }

  // Applies URL validators based on selected collection mode
  private applyPlatformValidators(mode: string): void {
    const websiteUrlControl = this.platformForm.get('websiteUrl');
    const androidAppUrlControl = this.platformForm.get('androidAppUrl');
    const iosAppUrlControl = this.platformForm.get('iosAppUrl');

    if (!websiteUrlControl || !androidAppUrlControl || !iosAppUrlControl) {
      return;
    }

    if (mode === 'website-app') {
      // Website/app mode requires the main URL
      websiteUrlControl.setValidators([
        Validators.required,
        this.urlValidator.bind(this),
      ]);

      // App URLs remain optional but valid format is required if user enters value
      androidAppUrlControl.setValidators([this.optionalUrlValidator.bind(this)]);
      iosAppUrlControl.setValidators([this.optionalUrlValidator.bind(this)]);
    } else {
      // Without website/app mode should allow user to continue directly
      websiteUrlControl.clearValidators();
      androidAppUrlControl.clearValidators();
      iosAppUrlControl.clearValidators();

      // Clear values so old validation state does not block the button
      websiteUrlControl.setValue('', { emitEvent: false });
      androidAppUrlControl.setValue('', { emitEvent: false });
      iosAppUrlControl.setValue('', { emitEvent: false });

      websiteUrlControl.markAsUntouched();
      androidAppUrlControl.markAsUntouched();
      iosAppUrlControl.markAsUntouched();
    }

    websiteUrlControl.updateValueAndValidity({ emitEvent: false });
    androidAppUrlControl.updateValueAndValidity({ emitEvent: false });
    iosAppUrlControl.updateValueAndValidity({ emitEvent: false });
  }

  isSidebarActive(section: SectionKey): boolean {
    return this.currentSection === section;
  }

  isSidebarCompleted(section: SectionKey): boolean {
    if (section === 'business') {
      return (
        this.currentStep === 'signing-authority' ||
        this.currentStep === 'business-address' ||
        this.currentStep === 'video-kyc' ||
        this.currentStep === 'thank-you'
      );
    }

    if (section === 'kyc') {
      return this.currentStep === 'video-kyc' || this.currentStep === 'thank-you';
    }

    if (section === 'documents') {
      return this.currentStep === 'thank-you';
    }

    return false;
  }

  isStep(step: StepKey): boolean {
    return this.currentStep === step;
  }

  goBack(): void {
    if (this.showUploadDocumentsModal) {
      this.closeUploadDocumentsModal();
      return;
    }

    if (this.showBankConfirmModal) {
      this.closeBankConfirmModal();
      return;
    }

    switch (this.currentStep) {
      case 'bank-details':
        this.currentStep = 'platform';
        break;

      case 'signing-authority':
        this.currentStep = 'bank-details';
        break;

      case 'business-address':
        this.currentStep = 'signing-authority';
        break;

      case 'video-kyc':
        this.currentStep = 'business-address';
        break;

      case 'thank-you':
        this.currentStep = 'video-kyc';
        break;

      default:
        this.router.navigateByUrl('/');
        break;
    }
  }

  goToBusinessSection(): void {
    this.currentStep = 'platform';
  }

  goToKycSection(): void {
    if (
      this.isSidebarCompleted('business') ||
      this.currentSection === 'kyc' ||
      this.currentSection === 'documents'
    ) {
      this.currentStep = 'signing-authority';
    }
  }

  goToDocumentsSection(): void {
    if (this.isSidebarCompleted('kyc') || this.currentSection === 'documents') {
      this.currentStep = 'video-kyc';
    }
  }

  goToBankDetails(): void {
    if (this.platformForm.invalid) {
      this.platformForm.markAllAsTouched();
      return;
    }

    this.currentStep = 'bank-details';
  }

  submitBankDetails(): void {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }

    const accountNumber = this.bankForm.get('bankAccountNumber')?.value || '';
    this.maskedAccountNumber = this.getMaskedAccountNumber(accountNumber);
    this.matchedBankName = 'BANK OF INDIA | SITAPUR';

    this.showBankConfirmModal = true;
    this.lockBodyScroll();
  }

  closeBankConfirmModal(): void {
    this.showBankConfirmModal = false;
    this.unlockBodyScroll();
  }

  reEnterBankDetails(): void {
    this.showBankConfirmModal = false;
    this.unlockBodyScroll();

    this.bankForm.patchValue({
      bankAccountNumber: '',
      ifscCode: '',
    });

    this.bankForm.get('bankAccountNumber')?.markAsUntouched();
    this.bankForm.get('ifscCode')?.markAsUntouched();
  }

  confirmAndConnectBank(): void {
    this.showBankConfirmModal = false;
    this.unlockBodyScroll();
    this.currentStep = 'signing-authority';
  }

  submitSigningAuthorityDetails(): void {
    if (this.signingAuthorityForm.invalid) {
      this.signingAuthorityForm.markAllAsTouched();
      return;
    }

    this.currentStep = 'business-address';
  }

  submitBusinessAddressDetails(): void {
    if (this.businessAddressForm.invalid) {
      this.businessAddressForm.markAllAsTouched();
      return;
    }

    this.currentStep = 'video-kyc';
  }

  // Opens the upload documents modal after clicking Schedule Video KYC
  scheduleVideoKyc(): void {
    this.showUploadDocumentsModal = true;
    this.lockBodyScroll();
  }

  // Closes the upload documents modal and restores page scrolling
  closeUploadDocumentsModal(): void {
    this.showUploadDocumentsModal = false;
    this.unlockBodyScroll();
  }

  openCameraInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  // Handles file selection for a specific upload field
  onFileSelected(event: Event, controlName: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;

    if (!file) {
      return;
    }

    this.uploadDocumentsForm.patchValue({
      [controlName]: file,
    });

    this.uploadDocumentsForm.get(controlName)?.markAsTouched();
    this.uploadDocumentsForm.get(controlName)?.updateValueAndValidity();

    this.selectedDocumentNames = {
      ...this.selectedDocumentNames,
      [controlName]: file.name,
    };
  }

  // Submits all uploaded KYC documents and shows the thank you screen
  submitKycDocuments(): void {
    if (this.uploadDocumentsForm.invalid) {
      this.uploadDocumentsForm.markAllAsTouched();
      return;
    }

    console.log('Platform details:', this.platformForm.value);
    console.log('Bank details:', this.bankForm.value);
    console.log('Signing authority details:', this.signingAuthorityForm.value);
    console.log('Business address details:', this.businessAddressForm.value);
    console.log('Uploaded documents:', this.uploadDocumentsForm.value);

    this.showUploadDocumentsModal = false;
    this.unlockBodyScroll();
    this.currentStep = 'thank-you';
  }

  onAccountNumberInput(): void {
    const control = this.bankForm.get('bankAccountNumber');
    if (!control) return;

    const numericValue = (control.value || '').replace(/\D/g, '');
    control.setValue(numericValue, { emitEvent: false });
  }

  onIfscInput(): void {
    const control = this.bankForm.get('ifscCode');
    if (!control) return;

    const formattedValue = (control.value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    control.setValue(formattedValue, { emitEvent: false });
  }

  onPanInput(): void {
    const control = this.signingAuthorityForm.get('signingAuthorityPan');
    if (!control) return;

    const formattedValue = (control.value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    control.setValue(formattedValue, { emitEvent: false });
  }

  getMaskedAccountNumber(accountNumber: string): string {
    if (!accountNumber) return '';

    if (accountNumber.length <= 4) {
      return accountNumber;
    }

    return `${'*'.repeat(accountNumber.length - 4)}${accountNumber.slice(-4)}`;
  }

  getStepLabel(): string {
    switch (this.currentStep) {
      case 'platform':
        return 'STEP 1 OF 5';
      case 'bank-details':
        return 'STEP 2 OF 5';
      case 'signing-authority':
        return 'STEP 3 OF 5';
      case 'business-address':
        return 'STEP 4 OF 5';
      case 'video-kyc':
        return 'STEP 5 OF 5';
      case 'thank-you':
        return 'COMPLETED';
      default:
        return '';
    }
  }

  urlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null;

    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
    return pattern.test(value) ? null : { invalidUrl: true };
  }

  optionalUrlValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null;

    const pattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;
    return pattern.test(value) ? null : { invalidUrl: true };
  }

  ifscValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null;

    const pattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return pattern.test(value) ? null : { invalidIfsc: true };
  }

  private lockBodyScroll(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  private unlockBodyScroll(): void {
    this.renderer.removeStyle(document.body, 'overflow');
  }

  
}

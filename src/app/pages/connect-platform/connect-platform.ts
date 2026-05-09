import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ElementRef,
  ViewChild
} from '@angular/core';

import SignaturePad from 'signature_pad';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { OnboardingHeaderComponent } from '../../components/onboarding-header/onboarding-header';
import { ToastService } from '../../services/toast/toast.service';
import { ConnectPlatformService, SaveConnectPlatformRequest } from '../../services/connect-platform/connect-platform.service';
import { AuthService } from '../../services/auth/auth.service';
import { BankAccountDetailsService, SaveBankAccountDetailRequest } from '../../services/bank-account-details/bank-account-details.service';
import { BusinessAddressService, SaveBusinessAddressRequest } from '../../services/business-address/business-address.service';

type StepKey =
  | 'platform'
  | 'bank-details'
  | 'signing-authority'
  | 'business-address'
  | 'video-kyc'
  | 'service-agreement'
  | 'thank-you';

type SectionKey = 'business' | 'kyc' | 'documents' | 'agreement';

@Component({
  selector: 'app-connect-platform',
  standalone: true,
  imports: [
  CommonModule,
  ReactiveFormsModule,
  FormsModule,
  OnboardingHeaderComponent,
  NgSelectModule,
],
  templateUrl: './connect-platform.html',
  styleUrl: './connect-platform.scss',
})
export class ConnectPlatformComponent implements OnInit, OnDestroy {
  currentStep: StepKey = 'platform';

  loading = true;
  saving = false;
  verifyingBank = false;
  bankApiMessage = '';
  bankApiMessageType: 'success' | 'error' | 'info' = 'info';
  showBankApiMessage = false;
  nameAtBank = '';
  isBankVerified = false;

  platformForm!: FormGroup;
  bankForm!: FormGroup;
  signingAuthorityForm!: FormGroup;
  businessAddressForm!: FormGroup;
  uploadDocumentsForm!: FormGroup;

  imageUrl = '../../../assets/images/website-illustration.png';

  showBankConfirmModal = false;
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

  // Agreement Step Properties
  selectedAgreementFile: File | null = null;
  agreementFileName: string = '';
  agreementDate: string = '';
  agreementAccepted: boolean = false;

 constructor(
  private fb: FormBuilder,
  private router: Router,
  private renderer: Renderer2,
  @Inject(PLATFORM_ID) private platformId: Object,
  private toastService: ToastService,
  private connectPlatformService: ConnectPlatformService,
  private cdr: ChangeDetectorRef,
  private authService: AuthService,
  private bankAccountDetailsService: BankAccountDetailsService,
  private businessAddressService: BusinessAddressService
) {
  this.initializeForms();
}

  ngOnInit(): void {
    this.determineInitialStep();
    this.setupCollectionModeWatcher();
    this.setupDifferentAddressWatcher();
    this.applyPlatformValidators(this.platformForm.get('collectionMode')?.value);
    if (isPlatformBrowser(this.platformId)) {
      this.loadConnectPlatform();
      this.loadBankAccountDetails();
      this.loadBusinessAddress();
    } else {
      this.loading = false;
    }
  }

  private determineInitialStep(): void {
    const onboardingStatus = this.authService.getOnboardingStatus();
    if (!onboardingStatus || !onboardingStatus.steps) {
      return;
    }

    const connectPlatformStep = onboardingStatus.steps.find((step: any) => step.stepKey === 'CONNECT_PLATFORM');
    if (connectPlatformStep && connectPlatformStep.connectPlatformSteps) {
      const activeSubStep = connectPlatformStep.connectPlatformSteps.steps.find((subStep: any) => subStep.isActive);
      if (activeSubStep) {
        const stepKeyMap: { [key: string]: StepKey } = {
          'CONNECT_MOBILE_APP_OR_WEBSITE': 'platform',
          'SHARE_BANK_ACCOUNT_DETAILS': 'bank-details',
          'SIGNING_AUTHORITY_DETAILS': 'signing-authority',
          'VERIFY_BUSINESS_ADDRESS': 'business-address',
          'COMPLETE_VIDEO_KYC': 'video-kyc',
          'SERVICE_AGREEMENT': 'service-agreement',
        };
        this.currentStep = stepKeyMap[activeSubStep.stepKey] || 'platform';
      }
    }
  }

  loadConnectPlatform(): void {
    this.connectPlatformService.getConnectPlatform().subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success && response.data) {
          const data = response.data;
          const pref = data.paymentCollectionPreference || '';
          const collectionMode =
            pref === 'WEBSITE' || pref === 'ON_MY_WEBSITE_APP'
              ? 'website-app'
              : 'without-website-app';
          this.platformForm.patchValue(
            {
              collectionMode,
              websiteUrl: data.websiteAppUrl || '',
              androidAppUrl: data.androidAppUrl || '',
              iosAppUrl: data.iosAppUrl || '',
            },
            { emitEvent: false }
          );
          this.applyPlatformValidators(collectionMode);

          // Check onboarding status and redirect if needed
          if (data.isOnboardingRejected) {
            this.router.navigate(['/onboarding-rejected']);
            return;
          }
          if (data.isServiceAgreementSubmitted && !data.isOnboardingCompleted && !data.isOnboardingRejected) {
            this.router.navigate(['/status-tracker']);
            return;
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        console.error('Error loading connect platform:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.unlockBodyScroll();
  }
  @ViewChild('signatureCanvas') set signatureCanvas(content: ElementRef<HTMLCanvasElement>) {
    if (content) {
      this._signatureCanvas = content;
      this.initializeSignaturePad();
    }
  }
  private _signatureCanvas!: ElementRef<HTMLCanvasElement>;

  signaturePad!: SignaturePad;
  signatureImage = '';
  isSigned = false;

  ngAfterViewInit(): void {
    // Initialization is now handled by the setter
  }
  initializeSignaturePad(): void {
    if (!isPlatformBrowser(this.platformId) || !this._signatureCanvas) {
      return;
    }

    const canvas = this._signatureCanvas.nativeElement;
    const ratio = Math.max(window.devicePixelRatio || 1, 1);

    // Set canvas dimensions based on container
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d')?.scale(ratio, ratio);

    this.signaturePad = new SignaturePad(canvas, {
      minWidth: 1.5,
      maxWidth: 3,
      penColor: '#1565c0',
    });

    // Add listener to track signing state
    this.signaturePad.addEventListener('beginStroke', () => {
      this.isSigned = true;
    });
  }

  clearSignature(): void {
    if (this.signaturePad) {
      this.signaturePad.clear();
      this.isSigned = false;
      this.signatureImage = '';
    }
  }

  saveSignature(): void {
    if (!this.signaturePad || this.signaturePad.isEmpty()) {
      alert('Please provide signature first.');
      this.isSigned = false;
      return;
    }

    this.signatureImage = this.signaturePad.toDataURL('image/png');
    this.isSigned = true;
    console.log('Signature saved:', this.signatureImage);
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
      address: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      state: ['', Validators.required],
      city: ['', Validators.required],
      hasDifferentAddress: ['no', Validators.required],
      operatingAddress: [''],
      operatingPostalCode: ['', Validators.pattern(/^[0-9]{6}$/)],
      operatingState: [''],
      operatingCity: [''],
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

    if (
      this.currentStep === 'video-kyc' ||
      this.currentStep === 'thank-you'
    ) {
      return 'documents';
    }

    if (this.currentStep === 'service-agreement') {
      return 'agreement';
    }

    return 'agreement';
  }

  private setupCollectionModeWatcher(): void {
    this.platformForm.get('collectionMode')?.valueChanges.subscribe((mode) => {
      this.applyPlatformValidators(mode);
    });
  }

  private setupDifferentAddressWatcher(): void {
    this.businessAddressForm.get('hasDifferentAddress')?.valueChanges.subscribe((value) => {
      this.applyOperatingAddressValidators(value);
    });
  }

  private applyOperatingAddressValidators(hasDifferent: string): void {
    const operatingAddressControl = this.businessAddressForm.get('operatingAddress');
    const operatingPostalCodeControl = this.businessAddressForm.get('operatingPostalCode');
    const operatingStateControl = this.businessAddressForm.get('operatingState');
    const operatingCityControl = this.businessAddressForm.get('operatingCity');

    if (!operatingAddressControl || !operatingPostalCodeControl || !operatingStateControl || !operatingCityControl) {
      return;
    }

    if (hasDifferent === 'yes') {
      operatingAddressControl.setValidators([Validators.required]);
      operatingPostalCodeControl.setValidators([Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
      operatingStateControl.setValidators([Validators.required]);
      operatingCityControl.setValidators([Validators.required]);
    } else {
      operatingAddressControl.clearValidators();
      operatingPostalCodeControl.setValidators([Validators.pattern(/^[0-9]{6}$/)]);
      operatingStateControl.clearValidators();
      operatingCityControl.clearValidators();

      operatingAddressControl.setValue('', { emitEvent: false });
      operatingPostalCodeControl.setValue('', { emitEvent: false });
      operatingStateControl.setValue('', { emitEvent: false });
      operatingCityControl.setValue('', { emitEvent: false });

      operatingAddressControl.markAsUntouched();
      operatingPostalCodeControl.markAsUntouched();
      operatingStateControl.markAsUntouched();
      operatingCityControl.markAsUntouched();
    }

    operatingAddressControl.updateValueAndValidity({ emitEvent: false });
    operatingPostalCodeControl.updateValueAndValidity({ emitEvent: false });
    operatingStateControl.updateValueAndValidity({ emitEvent: false });
    operatingCityControl.updateValueAndValidity({ emitEvent: false });
  }

  private applyPlatformValidators(mode: string): void {
    const websiteUrlControl = this.platformForm.get('websiteUrl');
    const androidAppUrlControl = this.platformForm.get('androidAppUrl');
    const iosAppUrlControl = this.platformForm.get('iosAppUrl');

    if (!websiteUrlControl || !androidAppUrlControl || !iosAppUrlControl) {
      return;
    }

    if (mode === 'website-app') {
      websiteUrlControl.setValidators([
        Validators.required,
        this.urlValidator.bind(this),
      ]);

      androidAppUrlControl.setValidators([this.optionalUrlValidator.bind(this)]);
      iosAppUrlControl.setValidators([this.optionalUrlValidator.bind(this)]);
    } else {
      websiteUrlControl.clearValidators();
      androidAppUrlControl.clearValidators();
      iosAppUrlControl.clearValidators();

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
      return (
        this.currentStep === 'service-agreement' ||
        this.currentStep === 'thank-you'
      );
    }

    if (section === 'agreement') {
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

        case 'platform':
        this.router.navigate(['/share-business-details']);
        break;

     // Navigate back from service agreement to video KYC.
case 'service-agreement':
  this.currentStep = 'video-kyc';
  break;

// Navigate back from thank you page to service agreement.
case 'thank-you':
  this.currentStep = 'service-agreement';
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

    const mode = this.platformForm.get('collectionMode')?.value;
    const payload: SaveConnectPlatformRequest = {
      paymentCollectionPreference:
        mode === 'website-app' ? 'ON_MY_WEBSITE_APP' : 'WITHOUT_WEBSITE_APP',
      websiteAppUrl: this.platformForm.get('websiteUrl')?.value?.trim() || '',
      androidAppUrl: this.platformForm.get('androidAppUrl')?.value?.trim() || '',
      iosAppUrl: this.platformForm.get('iosAppUrl')?.value?.trim() || '',
    };

    this.saving = true;
    this.connectPlatformService.saveConnectPlatform(payload).subscribe({
      next: (response) => {
        this.saving = false;
        if (response.success) {
          this.toastService.success(
            response.message || 'Platform details saved successfully'
          );
          this.currentStep = 'bank-details';
        } else {
          const errorMsg =
            response.errors?.[0] ||
            response.message ||
            'Failed to save platform details';
          this.toastService.error(errorMsg);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        if (err.status === 400 && err.error?.errors) {
          const apiErrors = err.error.errors;
          if (apiErrors['WebsiteAppUrl']?.[0]) {
            this.platformForm
              .get('websiteUrl')
              ?.setErrors({ serverError: apiErrors['WebsiteAppUrl'][0] });
            this.platformForm.get('websiteUrl')?.markAsTouched();
          }
          if (apiErrors['AndroidAppUrl']?.[0]) {
            this.platformForm
              .get('androidAppUrl')
              ?.setErrors({ serverError: apiErrors['AndroidAppUrl'][0] });
            this.platformForm.get('androidAppUrl')?.markAsTouched();
          }
          if (apiErrors['IosAppUrl']?.[0]) {
            this.platformForm
              .get('iosAppUrl')
              ?.setErrors({ serverError: apiErrors['IosAppUrl'][0] });
            this.platformForm.get('iosAppUrl')?.markAsTouched();
          }
          this.toastService.error(
            'Please fix the validation errors and try again'
          );
        } else {
          const errorMsg =
            err.error?.errors?.[0] ||
            err.error?.message ||
            'An error occurred. Please try again.';
          this.toastService.error(errorMsg);
        }
        this.cdr.detectChanges();
      },
    });
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

  loadBankAccountDetails(): void {
    this.bankAccountDetailsService.getBankAccountDetail().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const data = response.data;
          this.bankForm.patchValue({
            bankHolderName: data.bankHolderName,
            bankAccountNumber: data.bankAccountNumber,
            ifscCode: data.ifsccode,
          });
          if (data.isVerified) {
            this.isBankVerified = true;
            this.nameAtBank = data.bankHolderName;
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          // Bank account details not found - this is expected for new users
          console.log('Bank account details not found, user needs to enter them');
        } else {
          console.error('Error loading bank account details:', err);
        }
        this.cdr.detectChanges();
      },
    });
  }

  verifyBankDetails(): void {
    const accountNumber = this.bankForm.get('bankAccountNumber')?.value;
    const ifscCode = this.bankForm.get('ifscCode')?.value;

    if (!accountNumber || !ifscCode) {
      this.bankForm.markAllAsTouched();
      return;
    }

    this.verifyingBank = true;
    this.bankAccountDetailsService.verifyBankDetails(accountNumber, ifscCode).subscribe({
      next: (response) => {
        this.verifyingBank = false;
        if (response.success && response.data) {
          const data = response.data;
          // Bank is valid if accountStatus is "VALID"
          if (data.accountStatus === 'VALID' && data.nameAtBank) {
            this.nameAtBank = data.nameAtBank;
            this.isBankVerified = true;
            this.bankForm.patchValue({
              bankHolderName: data.nameAtBank,
            });
            this.setBankApiMessage(data.message || 'Bank account verified successfully', 'success');
            this.toastService.success(data.message || 'Bank account verified successfully');
          } else {
            this.isBankVerified = false;
            this.setBankApiMessage(data.message || 'Bank account verification failed', 'error');
            this.toastService.error(data.message || 'Bank account verification failed');
          }
        } else {
          this.isBankVerified = false;
          this.setBankApiMessage(response.message || 'Bank account verification failed', 'error');
          this.toastService.error(response.message || 'Bank account verification failed');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.verifyingBank = false;
        const errorMsg = err.error?.message || err.error?.errors?.[0] || 'An error occurred during verification';
        this.setBankApiMessage(errorMsg, 'error');
        this.toastService.error(errorMsg);
        this.cdr.detectChanges();
      },
    });
  }

  setBankApiMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.bankApiMessage = message;
    this.bankApiMessageType = type;
    this.showBankApiMessage = true;
  }

  hideBankApiMessage(): void {
    this.showBankApiMessage = false;
    this.bankApiMessage = '';
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
    this.hideBankApiMessage();
    this.isBankVerified = false;
    this.nameAtBank = '';
  }

  confirmAndConnectBank(): void {
    this.showBankConfirmModal = false;
    this.unlockBodyScroll();
    this.saveBankAccountDetails();
  }

  saveBankAccountDetails(): void {
    if (this.bankForm.invalid) {
      this.bankForm.markAllAsTouched();
      return;
    }

    const accountNumber = this.bankForm.get('bankAccountNumber')?.value || '';
    const ifscCode = this.bankForm.get('ifscCode')?.value || '';
    const bankHolderName = this.bankForm.get('bankHolderName')?.value || '';

    // Extract bank name from IFSC or use default
    const bankName = 'BOI'; // This should ideally come from verification or a lookup
    const accountType = 'CURRENT'; // Default account type

    const payload: SaveBankAccountDetailRequest = {
      bankHolderName,
      bankAccountNumber: accountNumber,
      ifsccode: ifscCode,
      bankName,
      accountType,
    };

    this.saving = true;
    this.bankAccountDetailsService.saveBankAccountDetail(payload).subscribe({
      next: (response) => {
        this.saving = false;
        if (response.success && response.data) {
          const data = response.data;
          const onboardingStatus = data.onboardingStatus;

          this.toastService.success(response.message || 'Bank account details saved successfully');

          // Handle redirection based on onboarding status
          if (onboardingStatus.isOnboardingRejected) {
            this.router.navigate(['/onboarding-rejected']);
            return;
          }

          if (onboardingStatus.isServiceAgreementSubmitted && !onboardingStatus.isOnboardingCompleted && !onboardingStatus.isOnboardingRejected) {
            this.router.navigate(['/status-tracker']);
            return;
          }

          // Proceed to next step normally
          this.currentStep = 'signing-authority';
        } else {
          const errorMsg = response.errors?.[0] || response.message || 'Failed to save bank account details';
          this.setBankApiMessage(errorMsg, 'error');
          this.toastService.error(errorMsg);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        if (err.status === 400 && err.error?.errors) {
          const apiErrors = err.error.errors;
          if (apiErrors['Ifsccode']?.[0]) {
            this.bankForm
              .get('ifscCode')
              ?.setErrors({ serverError: apiErrors['Ifsccode'][0] });
            this.bankForm.get('ifscCode')?.markAsTouched();
            this.setBankApiMessage(apiErrors['Ifsccode'][0], 'error');
          }
          if (apiErrors['BankAccountNumber']?.[0]) {
            this.bankForm
              .get('bankAccountNumber')
              ?.setErrors({ serverError: apiErrors['BankAccountNumber'][0] });
            this.bankForm.get('bankAccountNumber')?.markAsTouched();
            this.setBankApiMessage(apiErrors['BankAccountNumber'][0], 'error');
          }
          if (apiErrors['BankHolderName']?.[0]) {
            this.bankForm
              .get('bankHolderName')
              ?.setErrors({ serverError: apiErrors['BankHolderName'][0] });
            this.bankForm.get('bankHolderName')?.markAsTouched();
            this.setBankApiMessage(apiErrors['BankHolderName'][0], 'error');
          }
          this.toastService.error('Please fix the validation errors and try again');
        } else {
          const errorMsg = err.error?.errors?.[0] || err.error?.message || 'An error occurred. Please try again.';
          this.setBankApiMessage(errorMsg, 'error');
          this.toastService.error(errorMsg);
        }
        this.cdr.detectChanges();
      },
    });
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

    const hasDifferentAddress = this.businessAddressForm.get('hasDifferentAddress')?.value === 'yes';
    const payload: SaveBusinessAddressRequest = {
      addressLine1: this.businessAddressForm.get('address')?.value?.trim() || '',
      addressLine2: '',
      city: this.businessAddressForm.get('city')?.value?.trim() || '',
      state: this.businessAddressForm.get('state')?.value?.trim() || '',
      postalCode: this.businessAddressForm.get('postalCode')?.value?.trim() || '',
      country: 'India',
      hasDifferentOperatingAddress: hasDifferentAddress,
      operatingAddressLine1: hasDifferentAddress ? this.businessAddressForm.get('operatingAddress')?.value?.trim() || '' : '',
      operatingAddressLine2: '',
      operatingCity: hasDifferentAddress ? this.businessAddressForm.get('operatingCity')?.value?.trim() || '' : '',
      operatingState: hasDifferentAddress ? this.businessAddressForm.get('operatingState')?.value?.trim() || '' : '',
      operatingPostalCode: hasDifferentAddress ? this.businessAddressForm.get('operatingPostalCode')?.value?.trim() || '' : '',
      operatingCountry: 'India',
    };

    this.saving = true;
    this.businessAddressService.saveBusinessAddress(payload).subscribe({
      next: (response) => {
        this.saving = false;
        if (response.success && response.data) {
          const data = response.data;
          const onboardingStatus = data.onboardingStatus;

          this.toastService.success(response.message || 'Business address saved successfully');

          // Handle redirection based on onboarding status
          if (onboardingStatus.isOnboardingRejected) {
            this.router.navigate(['/onboarding-rejected']);
            return;
          }

          if (onboardingStatus.isServiceAgreementSubmitted && !onboardingStatus.isOnboardingCompleted && !onboardingStatus.isOnboardingRejected) {
            this.router.navigate(['/status-tracker']);
            return;
          }

          // Proceed to next step normally
          this.currentStep = 'video-kyc';
        } else {
          const errorMsg = response.errors?.[0] || response.message || 'Failed to save business address';
          this.toastService.error(errorMsg);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        if (err.status === 400 && err.error?.errors) {
          const apiErrors = err.error.errors;
          if (apiErrors['AddressLine1']?.[0]) {
            this.businessAddressForm
              .get('address')
              ?.setErrors({ serverError: apiErrors['AddressLine1'][0] });
            this.businessAddressForm.get('address')?.markAsTouched();
          }
          if (apiErrors['PostalCode']?.[0]) {
            this.businessAddressForm
              .get('postalCode')
              ?.setErrors({ serverError: apiErrors['PostalCode'][0] });
            this.businessAddressForm.get('postalCode')?.markAsTouched();
          }
          if (apiErrors['State']?.[0]) {
            this.businessAddressForm
              .get('state')
              ?.setErrors({ serverError: apiErrors['State'][0] });
            this.businessAddressForm.get('state')?.markAsTouched();
          }
          if (apiErrors['City']?.[0]) {
            this.businessAddressForm
              .get('city')
              ?.setErrors({ serverError: apiErrors['City'][0] });
            this.businessAddressForm.get('city')?.markAsTouched();
          }
          if (apiErrors['OperatingAddressLine1']?.[0]) {
            this.businessAddressForm
              .get('operatingAddress')
              ?.setErrors({ serverError: apiErrors['OperatingAddressLine1'][0] });
            this.businessAddressForm.get('operatingAddress')?.markAsTouched();
          }
          if (apiErrors['OperatingPostalCode']?.[0]) {
            this.businessAddressForm
              .get('operatingPostalCode')
              ?.setErrors({ serverError: apiErrors['OperatingPostalCode'][0] });
            this.businessAddressForm.get('operatingPostalCode')?.markAsTouched();
          }
          if (apiErrors['OperatingState']?.[0]) {
            this.businessAddressForm
              .get('operatingState')
              ?.setErrors({ serverError: apiErrors['OperatingState'][0] });
            this.businessAddressForm.get('operatingState')?.markAsTouched();
          }
          if (apiErrors['OperatingCity']?.[0]) {
            this.businessAddressForm
              .get('operatingCity')
              ?.setErrors({ serverError: apiErrors['OperatingCity'][0] });
            this.businessAddressForm.get('operatingCity')?.markAsTouched();
          }
          this.toastService.error('Please fix the validation errors and try again');
        } else {
          const errorMsg = err.error?.errors?.[0] || err.error?.message || 'An error occurred. Please try again.';
          this.toastService.error(errorMsg);
        }
        this.cdr.detectChanges();
      },
    });
  }

  loadBusinessAddress(): void {
    this.businessAddressService.getBusinessAddress().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const data = response.data;
          const hasDifferentAddress = data.hasDifferentOperatingAddress ? 'yes' : 'no';
          this.businessAddressForm.patchValue({
            address: data.addressLine1,
            postalCode: data.postalCode,
            state: data.state,
            city: data.city,
            hasDifferentAddress: hasDifferentAddress,
            operatingAddress: data.operatingAddressLine1,
            operatingPostalCode: data.operatingPostalCode,
            operatingState: data.operatingState,
            operatingCity: data.operatingCity,
          });
          this.applyOperatingAddressValidators(hasDifferentAddress);

          // Check onboarding status and redirect if needed
          if (data.isOnboardingRejected) {
            this.router.navigate(['/onboarding-rejected']);
            return;
          }
          if (data.isServiceAgreementSubmitted && !data.isOnboardingCompleted && !data.isOnboardingRejected) {
            this.router.navigate(['/status-tracker']);
            return;
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          // Business address not found - this is expected for new users
          console.log('Business address not found, user needs to enter it');
        } else {
          console.error('Error loading business address:', err);
        }
        this.cdr.detectChanges();
      },
    });
  }

  scheduleVideoKyc(): void {
    this.showUploadDocumentsModal = true;
    this.lockBodyScroll();
  }

  closeUploadDocumentsModal(): void {
    this.showUploadDocumentsModal = false;
    this.unlockBodyScroll();
  }

  openCameraInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

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
   // Navigate user to service agreement step.
this.currentStep = 'service-agreement';
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
      case 'service-agreement':
        return 'FINAL STEP';
      case 'thank-you':
        return 'COMPLETED';
      default:
        return '';
    }
  }

  /**
   * Opens agreement document in a new browser tab.
   */
  viewAgreement(): void {
  const pdfUrl = '/assets/images/agreement/service-agreement.pdf';

  window.open(pdfUrl, '_blank');
}

  /**
   * Downloads agreement PDF document.
   */
  downloadAgreement(): void {
  const link = document.createElement('a');

  link.setAttribute(
    'href',
    '/assets/images/agreement/service-agreement.pdf'
  );

  link.setAttribute(
    'download',
    'service-agreement.pdf'
  );

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

  /**
   * Handles uploaded agreement file selection.
   */
  onAgreementFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedAgreementFile = input.files[0];
      this.agreementFileName = input.files[0].name;
    }
  }

  /**
   * Navigates user to thank you page.
   */
  goToThankYouPage(): void {
    this.currentStep = 'thank-you';
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
  if (isPlatformBrowser(this.platformId)) {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }
}

private unlockBodyScroll(): void {
  if (isPlatformBrowser(this.platformId)) {
    this.renderer.removeStyle(document.body, 'overflow');
  }
}
}
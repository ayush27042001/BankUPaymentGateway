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
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog';
import { ToastService } from '../../services/toast/toast.service';
import { ConnectPlatformService, SaveConnectPlatformRequest } from '../../services/connect-platform/connect-platform.service';
import { AuthService } from '../../services/auth/auth.service';
import { BankAccountDetailsService, SaveBankAccountDetailRequest } from '../../services/bank-account-details/bank-account-details.service';
import { SigningAuthorityService, PepStatus, SigningAuthorityDetail, SaveSigningAuthorityRequest } from '../../services/signing-authority/signing-authority.service';
import { BusinessAddressService, SaveBusinessAddressRequest } from '../../services/business-address/business-address.service';
import { BusinessProofTypeService, BusinessProofType } from '../../services/business-proof-type/business-proof-type.service';
import { DocumentService, DocumentType, UploadedDocument } from '../../services/document/document.service';

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
  ConfirmationDialogComponent,
  NgSelectModule,
],
  templateUrl: './connect-platform.html',
  styleUrls: ['./connect-platform.scss'],
})
export class ConnectPlatformComponent implements OnInit, OnDestroy {
  currentStep: StepKey = 'platform';

  loading = true;
  saving = false;
  verifyingBank = false;
  verifyingPan = false;
  bankApiMessage = '';
  bankApiMessageType: 'success' | 'error' | 'info' = 'info';
  showBankApiMessage = false;
  signingApiMessage = '';
  signingApiMessageType: 'success' | 'error' | 'info' = 'info';
  showSigningApiMessage = false;
  documentApiMessage = '';
  documentApiMessageType: 'success' | 'error' | 'info' = 'info';
  showDocumentApiMessage = false;
  showDeleteConfirmModal = false;
  documentTypeToDelete: number | null = null;
  nameAtBank = '';
  isBankVerified = false;
  isPanVerified = false;
  originalIfscCode = '';

  platformForm!: FormGroup;
  bankForm!: FormGroup;
  signingAuthorityForm!: FormGroup;
  businessAddressForm!: FormGroup;
  uploadDocumentsForm!: FormGroup;

  pepStatuses: PepStatus[] = [];
  signingAuthorityDetail: SigningAuthorityDetail | null = null;
  originalSigningAuthorityPan: string = '';
  businessProofTypes: BusinessProofType[] = [];

  documentTypes: DocumentType[] = [];
  uploadedDocuments: { [key: number]: UploadedDocument } = {};
  uploadingDocuments: { [key: number]: boolean } = {};
  documentFiles: { [key: number]: File | undefined } = {};

  imageUrl = '../../../assets/images/website-illustration.png';

  showBankConfirmModal = false;
  showUploadDocumentsModal = false;

  maskedAccountNumber = '';
  matchedBankName = '';

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
  private signingAuthorityService: SigningAuthorityService,
  private businessAddressService: BusinessAddressService,
  private businessProofTypeService: BusinessProofTypeService,
  private documentService: DocumentService
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
      this.loadPepStatuses();
      this.loadSigningAuthorityDetails();
      this.autoFetchEmailFromAuth();
      this.loadBusinessAddress();
      this.loadBusinessProofTypes();
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
      signingAuthorityName: ['', Validators.required],
      signingAuthorityEmail: ['', [Validators.required, Validators.email]],
      signingAuthorityPan: [
        '',
        [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]$/)],
      ],
      pepstatusId: [1, Validators.required],
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

    // Add conditional validation for operating address fields
    this.businessAddressForm.get('hasDifferentAddress')?.valueChanges.subscribe((value) => {
      this.updateOperatingAddressValidators(value);
    });

    this.uploadDocumentsForm = this.fb.group({
      aadhaarCard: [null, Validators.required],
      panCard: [null, Validators.required],
      photoFile: [null, Validators.required],
      businessProofType: [''],
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

  private updateOperatingAddressValidators(value: string): void {
    const operatingAddressControl = this.businessAddressForm.get('operatingAddress');
    const operatingPostalCodeControl = this.businessAddressForm.get('operatingPostalCode');
    const operatingStateControl = this.businessAddressForm.get('operatingState');
    const operatingCityControl = this.businessAddressForm.get('operatingCity');

    if (!operatingAddressControl || !operatingPostalCodeControl || !operatingStateControl || !operatingCityControl) {
      return;
    }

    if (value === 'yes') {
      operatingAddressControl.setValidators([Validators.required]);
      operatingPostalCodeControl.setValidators([Validators.required, Validators.pattern(/^[0-9]{6}$/)]);
      operatingStateControl.setValidators([Validators.required]);
      operatingCityControl.setValidators([Validators.required]);
    } else {
      operatingAddressControl.clearValidators();
      operatingPostalCodeControl.clearValidators();
      operatingStateControl.clearValidators();
      operatingCityControl.clearValidators();

      // Clear values when switching to "no"
      operatingAddressControl.setValue('');
      operatingPostalCodeControl.setValue('');
      operatingStateControl.setValue('');
      operatingCityControl.setValue('');

      operatingAddressControl.markAsUntouched();
      operatingPostalCodeControl.markAsUntouched();
      operatingStateControl.markAsUntouched();
      operatingCityControl.markAsUntouched();
    }

    operatingAddressControl.updateValueAndValidity({ emitEvent: false });
    operatingPostalCodeControl.updateValueAndValidity({ emitEvent: false });
    operatingStateControl.updateValueAndValidity({ emitEvent: false });
    operatingCityControl.updateValueAndValidity({ emitEvent: false });

    this.cdr.detectChanges();
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
          // Set original IFSC code if data exists (same logic as PAN)
          if (data.ifsccode) {
            this.originalIfscCode = data.ifsccode;
          }
          // Mark bank as verified if data exists (same logic as PAN)
          if (data.bankHolderName || data.bankAccountNumber || data.ifsccode) {
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
            this.originalIfscCode = ifscCode;
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

  setDocumentApiMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.documentApiMessage = message;
    this.documentApiMessageType = type;
    this.showDocumentApiMessage = true;
  }

  hideDocumentApiMessage(): void {
    this.showDocumentApiMessage = false;
    this.documentApiMessage = '';
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

  loadPepStatuses(): void {
    this.signingAuthorityService.getPepStatuses().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.pepStatuses = response.data;
          // Set default to "Not Applicable" (pepstatusId: 1)
          const notApplicable = this.pepStatuses.find(status => status.statusName === 'Not Applicable');
          if (notApplicable) {
            this.signingAuthorityForm.patchValue({ pepstatusId: notApplicable.pepstatusId });
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading PEP statuses:', err);
        this.cdr.detectChanges();
      },
    });
  }

  loadBusinessProofTypes(): void {
    this.businessProofTypeService.getBusinessProofTypes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.businessProofTypes = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading business proof types:', err);
        this.cdr.detectChanges();
      },
    });
  }

  loadSigningAuthorityDetails(): void {
    this.signingAuthorityService.getSigningAuthorityDetails().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.signingAuthorityDetail = response.data;
          this.originalSigningAuthorityPan = response.data.signingAuthorityPan || '';
          this.signingAuthorityForm.patchValue({
            signingAuthorityName: response.data.signingAuthorityName,
            signingAuthorityEmail: response.data.signingAuthorityEmail,
            signingAuthorityPan: response.data.signingAuthorityPan,
            pepstatusId: response.data.pepstatusId,
          });
          // Mark PAN as verified if data exists
          if (response.data.signingAuthorityPan) {
            this.isPanVerified = true;
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 404) {
          console.log('Signing authority details not found, user needs to enter them');
        } else {
          console.error('Error loading signing authority details:', err);
        }
        this.cdr.detectChanges();
      },
    });
  }

  autoFetchEmailFromAuth(): void {
    const userData = this.authService.getUserData();
    if (userData && userData.email) {
      this.signingAuthorityForm.patchValue({
        signingAuthorityEmail: userData.email,
      });
    }
  }

  onPanInput(): void {
    const control = this.signingAuthorityForm.get('signingAuthorityPan');
    if (!control) return;

    const formattedValue = (control.value || '')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');

    control.setValue(formattedValue, { emitEvent: false });
    // Reset PAN verification when PAN changes from original
    if (formattedValue !== this.originalSigningAuthorityPan) {
      this.isPanVerified = false;
    } else if (formattedValue === this.originalSigningAuthorityPan && this.originalSigningAuthorityPan !== '') {
      // Restore verification and name when PAN matches original again
      this.isPanVerified = true;
      if (this.signingAuthorityDetail?.signingAuthorityName) {
        this.signingAuthorityForm.patchValue({
          signingAuthorityName: this.signingAuthorityDetail.signingAuthorityName,
        });
      }
    }
  }

  get isPanMatchesOriginal(): boolean {
    const currentPan = this.signingAuthorityForm.get('signingAuthorityPan')?.value || '';
    return currentPan === this.originalSigningAuthorityPan && this.originalSigningAuthorityPan !== '';
  }

  get isIfscMatchesOriginal(): boolean {
    const currentIfsc = this.bankForm.get('ifscCode')?.value || '';
    return currentIfsc === this.originalIfscCode && this.originalIfscCode !== '';
  }

  verifyPan(): void {
    const panNumber = this.signingAuthorityForm.get('signingAuthorityPan')?.value;

    if (!panNumber || panNumber.length !== 10) {
      this.signingAuthorityForm.get('signingAuthorityPan')?.markAsTouched();
      this.setSigningApiMessage('Please enter a valid 10-character PAN number', 'error');
      return;
    }

    // Clear any previous server errors
    this.signingAuthorityForm.get('signingAuthorityPan')?.setErrors(null);

    this.verifyingPan = true;
    this.signingAuthorityService.verifyPan(panNumber).subscribe({
      next: (response) => {
        this.verifyingPan = false;
        if (response.success && response.data) {
          const data = response.data;
          // Treat presence of name as primary success indicator
          // API may return isValid: false even when name is provided
          if (data.name && data.name.trim() !== '') {
            this.isPanVerified = true;
            this.signingAuthorityForm.patchValue({
              signingAuthorityName: data.name,
            });
            this.setSigningApiMessage('PAN verified successfully', 'success');
            this.toastService.success('PAN verified successfully');
          } else {
            this.isPanVerified = false;
            const panMessage = response.data?.message || response.message || 'Invalid PAN - name not available';
            this.setSigningApiMessage(panMessage, 'error');
            this.toastService.error(panMessage);
            // Set server error to trigger red border
            this.signingAuthorityForm.get('signingAuthorityPan')?.setErrors({ serverError: panMessage });
            this.signingAuthorityForm.get('signingAuthorityPan')?.markAsTouched();
          }
        } else {
          this.isPanVerified = false;
          const panMessage = response.message || 'PAN verification failed';
          this.setSigningApiMessage(panMessage, 'error');
          this.toastService.error(panMessage);
          // Set server error to trigger red border
          this.signingAuthorityForm.get('signingAuthorityPan')?.setErrors({ serverError: panMessage });
          this.signingAuthorityForm.get('signingAuthorityPan')?.markAsTouched();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.verifyingPan = false;
        const errorMsg = err.error?.message || err.error?.errors?.[0] || 'An error occurred during PAN verification';
        this.setSigningApiMessage(errorMsg, 'error');
        this.toastService.error(errorMsg);
        // Set server error to trigger red border
        this.signingAuthorityForm.get('signingAuthorityPan')?.setErrors({ serverError: errorMsg });
        this.signingAuthorityForm.get('signingAuthorityPan')?.markAsTouched();
        this.cdr.detectChanges();
      },
    });
  }

  setSigningApiMessage(message: string, type: 'success' | 'error' | 'info'): void {
    this.signingApiMessage = message;
    this.signingApiMessageType = type;
    this.showSigningApiMessage = true;
  }

  hideSigningApiMessage(): void {
    this.showSigningApiMessage = false;
    this.signingApiMessage = '';
  }

  submitSigningAuthorityDetails(): void {
    if (this.saving) {
      return;
    }

    if (this.signingAuthorityForm.invalid) {
      this.signingAuthorityForm.markAllAsTouched();
      return;
    }

    // Validate PAN before submission
    if (!this.isPanVerified) {
      this.setSigningApiMessage('Please verify your PAN before submitting', 'error');
      this.toastService.error('Please verify your PAN before submitting');
      return;
    }

    const payload: SaveSigningAuthorityRequest = {
      signingAuthorityName: this.signingAuthorityForm.get('signingAuthorityName')?.value,
      signingAuthorityEmail: this.signingAuthorityForm.get('signingAuthorityEmail')?.value,
      signingAuthorityPan: this.signingAuthorityForm.get('signingAuthorityPan')?.value,
      pepstatusId: this.signingAuthorityForm.get('pepstatusId')?.value,
    };

    this.saving = true;
    this.signingAuthorityService.saveSigningAuthorityDetails(payload).subscribe({
      next: (response) => {
        this.saving = false;
        if (response.success && response.data) {
          const data = response.data;
          const onboardingStatus = data.onboardingStatus;

          this.toastService.success(response.message || 'Signing authority details saved successfully');

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
          this.currentStep = 'business-address';
        } else {
          const errorMsg = response.errors?.[0] || response.message || 'Failed to save signing authority details';
          this.setSigningApiMessage(errorMsg, 'error');
          this.toastService.error(errorMsg);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.saving = false;
        if (err.status === 400 && err.error?.errors) {
          const apiErrors = err.error.errors;
          if (apiErrors['SigningAuthorityName']?.[0]) {
            this.signingAuthorityForm
              .get('signingAuthorityName')
              ?.setErrors({ serverError: apiErrors['SigningAuthorityName'][0] });
            this.signingAuthorityForm.get('signingAuthorityName')?.markAsTouched();
            this.setSigningApiMessage(apiErrors['SigningAuthorityName'][0], 'error');
          }
          if (apiErrors['SigningAuthorityEmail']?.[0]) {
            this.signingAuthorityForm
              .get('signingAuthorityEmail')
              ?.setErrors({ serverError: apiErrors['SigningAuthorityEmail'][0] });
            this.signingAuthorityForm.get('signingAuthorityEmail')?.markAsTouched();
            this.setSigningApiMessage(apiErrors['SigningAuthorityEmail'][0], 'error');
          }
          if (apiErrors['SigningAuthorityPan']?.[0]) {
            this.signingAuthorityForm
              .get('signingAuthorityPan')
              ?.setErrors({ serverError: apiErrors['SigningAuthorityPan'][0] });
            this.signingAuthorityForm.get('signingAuthorityPan')?.markAsTouched();
            this.setSigningApiMessage(apiErrors['SigningAuthorityPan'][0], 'error');
          }
          this.toastService.error('Please fix the validation errors and try again');
        } else {
          const errorMsg = err.error?.errors?.[0] || err.error?.message || 'An error occurred. Please try again.';
          this.setSigningApiMessage(errorMsg, 'error');
          this.toastService.error(errorMsg);
        }
        this.cdr.detectChanges();
      },
    });
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
    this.loadDocumentTypes();
    this.loadUploadedDocuments();
    this.showUploadDocumentsModal = true;
    this.lockBodyScroll();
  }

  closeUploadDocumentsModal(): void {
    this.showUploadDocumentsModal = false;
    this.unlockBodyScroll();
  }

  loadDocumentTypes(): void {
    this.documentService.getDocumentTypes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.documentTypes = response.data.filter(doc => doc.isActive);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading document types:', err);
        this.toastService.error('Failed to load document types');
        this.cdr.detectChanges();
      },
    });
  }

  loadUploadedDocuments(): void {
    this.uploadedDocuments = {};
    this.documentService.getMerchantDocuments().subscribe({
      next: (response) => {
        if (response.success && response.data?.documents) {
          response.data.documents.forEach(doc => {
            this.uploadedDocuments[doc.documentTypeId] = doc;
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading uploaded documents:', err);
        this.cdr.detectChanges();
      },
    });
  }

  onDocumentFileSelected(event: Event, documentTypeId: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length ? input.files[0] : null;

    if (!file) {
      return;
    }

    const documentType = this.documentTypes.find(doc => doc.documentTypeId === documentTypeId);
    if (!documentType) return;

    // Validate file size
    const maxSizeInBytes = documentType.maxFileSizeMb * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      this.toastService.error(`File size exceeds maximum limit of ${documentType.maxFileSizeMb}MB`);
      return;
    }

    // Validate file extension
    const allowedExtensions = documentType.allowedExtensions.split(',').map(ext => ext.trim().toLowerCase());
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(fileExtension)) {
      this.toastService.error(`Invalid file type. Allowed types: ${documentType.allowedExtensions}`);
      return;
    }

    this.documentFiles[documentTypeId] = file;
    this.cdr.detectChanges();
  }

  uploadDocument(documentTypeId: number): void {
    const file = this.documentFiles[documentTypeId];
    if (!file) {
      this.setDocumentApiMessage('Please select a file first', 'error');
      this.toastService.error('Please select a file first');
      return;
    }

    // Check if this is a business proof document and validate business proof type selection
    const documentType = this.documentTypes.find(doc => doc.documentTypeId === documentTypeId);
    if (documentType && documentType.documentCode === 'BUSINESS_PROOF') {
      const businessProofTypeId = this.uploadDocumentsForm.get('businessProofType')?.value || 0;
      if (!businessProofTypeId || businessProofTypeId === 0) {
        this.setDocumentApiMessage('Please select a Business Proof Type', 'error');
        this.toastService.error('Please select a Business Proof Type');
        return;
      }
    }

    const businessProofTypeId = this.uploadDocumentsForm.get('businessProofType')?.value || 0;

    this.uploadingDocuments[documentTypeId] = true;
    this.hideDocumentApiMessage();
    this.documentService.uploadDocument(documentTypeId, businessProofTypeId, file).subscribe({
      next: (response) => {
        this.uploadingDocuments[documentTypeId] = false;
        if (response.success && response.data) {
          const uploadedDoc: UploadedDocument = {
            documentUploadId: response.data.documentUploadId,
            mid: 0,
            documentTypeId: documentTypeId,
            documentTypeName: '',
            documentTypeCode: '',
            documentFileName: response.data.documentFileName,
            documentFilePath: response.data.documentFilePath,
            documentSizeBytes: 0,
            documentMimeType: '',
            isVerified: false,
            createdDate: '',
            updatedDate: ''
          };
          this.uploadedDocuments[documentTypeId] = uploadedDoc;
          delete this.documentFiles[documentTypeId];
          this.setDocumentApiMessage(response.message || 'Document uploaded successfully', 'success');

          // Handle onboarding status redirection
          if (response.data.onboardingStatus) {
            const onboardingStatus = response.data.onboardingStatus;
            if (onboardingStatus.isOnboardingRejected) {
              this.router.navigate(['/onboarding-rejected']);
              return;
            }
            if (onboardingStatus.isServiceAgreementSubmitted && !onboardingStatus.isOnboardingCompleted && !onboardingStatus.isOnboardingRejected) {
              this.router.navigate(['/status-tracker']);
              return;
            }
          }
        } else {
          this.setDocumentApiMessage(response.message || 'Failed to upload document', 'error');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.uploadingDocuments[documentTypeId] = false;
        const errorMsg = err.error?.message || err.error?.errors?.[0] || 'Failed to upload document';
        this.setDocumentApiMessage(errorMsg, 'error');
        this.cdr.detectChanges();
      },
    });
  }

  deleteDocument(documentTypeId: number): void {
    const uploadedDoc = this.uploadedDocuments[documentTypeId];
    if (!uploadedDoc) {
      this.toastService.error('Document not found');
      return;
    }

    this.documentTypeToDelete = documentTypeId;
    this.showDeleteConfirmModal = true;
    this.lockBodyScroll();
  }

  closeDeleteConfirmModal(): void {
    this.showDeleteConfirmModal = false;
    this.documentTypeToDelete = null;
    this.unlockBodyScroll();
  }

  confirmDeleteDocument(): void {
    if (this.documentTypeToDelete === null) {
      return;
    }

    const documentTypeId = this.documentTypeToDelete;
    const uploadedDoc = this.uploadedDocuments[documentTypeId];
    if (!uploadedDoc) {
      this.toastService.error('Document not found');
      this.closeDeleteConfirmModal();
      return;
    }

    this.documentService.deleteDocument(uploadedDoc.documentUploadId).subscribe({
      next: (response) => {
        if (response.success) {
          delete this.uploadedDocuments[documentTypeId];
          this.setDocumentApiMessage(response.message || 'Document deleted successfully', 'success');
        } else {
          this.setDocumentApiMessage(response.message || 'Failed to delete document', 'error');
        }
        this.closeDeleteConfirmModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        const errorMsg = err.error?.message || err.error?.errors?.[0] || 'Failed to delete document';
        this.setDocumentApiMessage(errorMsg, 'error');
        this.toastService.error(errorMsg);
        this.closeDeleteConfirmModal();
        this.cdr.detectChanges();
      },
    });
  }

  downloadDocument(documentTypeId: number): void {
    const uploadedDoc = this.uploadedDocuments[documentTypeId];
    if (!uploadedDoc) {
      this.toastService.error('Document not found');
      return;
    }

    this.documentService.downloadDocument(uploadedDoc.documentUploadId).subscribe({
      next: (blob) => {
        const fileName = uploadedDoc.documentFileName || 'document';
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.toastService.error('Failed to download document');
      },
    });
  }

  editDocument(documentTypeId: number): void {
    delete this.uploadedDocuments[documentTypeId];
    this.cdr.detectChanges();
  }

  cancelDocumentSelection(documentTypeId: number): void {
    this.documentFiles[documentTypeId] = undefined;
    this.cdr.detectChanges();
  }

  isDocumentUploaded(documentTypeId: number): boolean {
    return !!this.uploadedDocuments[documentTypeId];
  }

  isDocumentUploading(documentTypeId: number): boolean {
    return this.uploadingDocuments[documentTypeId] || false;
  }

  getDocumentFile(documentTypeId: number): File | undefined {
    return this.documentFiles[documentTypeId];
  }

  getUploadedDocument(documentTypeId: number): UploadedDocument | undefined {
    return this.uploadedDocuments[documentTypeId];
  }

  areAllRequiredDocumentsUploaded(): boolean {
    const requiredDocuments = this.documentTypes.filter(doc => doc.isRequired && doc.isActive);
    return requiredDocuments.every(doc => this.isDocumentUploaded(doc.documentTypeId));
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
    if (!this.areAllRequiredDocumentsUploaded()) {
      this.toastService.error('Please upload all required documents');
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
    // Reset bank verification when IFSC changes from original
    if (formattedValue !== this.originalIfscCode) {
      this.isBankVerified = false;
    } else if (formattedValue === this.originalIfscCode && this.originalIfscCode !== '') {
      // Restore verification and bank holder name when IFSC matches original again
      this.isBankVerified = true;
      if (this.nameAtBank) {
        this.bankForm.patchValue({
          bankHolderName: this.nameAtBank,
        });
      }
    }
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
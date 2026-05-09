export interface CompletePanRequest {
  panCardNumber: string;
  nameOnPanCard: string;
  dateOfBirthOrIncorporation: string;
}

export interface OnboardingStep {
  stepNumber: number;
  stepName: string;
  stepKey: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface ConnectPlatformSteps {
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
}

export interface OnboardingStatus {
  stepNumber: number;
  stepName: string;
  isCompleted: boolean;
  isOnboardingCompleted: boolean;
  isServiceAgreementSubmitted: boolean;
  isOnboardingRejected: boolean;
  steps: OnboardingStep[];
  connectPlatformSteps?: ConnectPlatformSteps;
}

export interface CompletePanData {
  userId: number;
  mid: number;
  email: string;
  token: string;
  tokenExpiration: string;
  message: string;
  userName: string;
  formStep: string;
  step: number;
  isOnboardingCompleted: boolean;
  isServiceAgreementSubmitted: boolean;
  isOnboardingRejected: boolean;
  onboardingStatus: OnboardingStatus;
}

export interface CompletePanResponse {
  success: boolean;
  message: string;
  data: CompletePanData | string;
  errors: string[];
  timestamp: string;
}

export interface PanDetailsData {
  panCardNumber: string;
  nameOnPanCard: string;
  dateOfBirthOrIncorporation: string;
  verificationStatus: string;
  merchantId: number;
  isOnboardingCompleted?: boolean;
  isServiceAgreementSubmitted?: boolean;
  isOnboardingRejected?: boolean;
}

export interface PanDetailsResponse {
  success: boolean;
  message: string;
  data: PanDetailsData;
  errors: string[];
  timestamp: string;
}

export interface PhoneCkycData {
  mid: number;
  mobileNumber: string;
  consentGiven: boolean;
  isOnboardingCompleted?: boolean;
  isServiceAgreementSubmitted?: boolean;
  isOnboardingRejected?: boolean;
}

export interface PhoneCkycResponse {
  success: boolean;
  message: string;
  data: PhoneCkycData;
  errors: any[];
  timestamp: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    remainingSeconds: number;
  };
  errors: any[];
  timestamp: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}

export interface VerifyOtpData {
  isVerified: boolean;
  message: string;
  registrationToken?: string;
  remainingAttempts?: number;
  userId?: number;
  mid?: number;
  userName?: string;
  email?: string;
  mobileNumber?: string;
  companyWebsite?: string;
  token?: string;
  tokenExpiration?: string;
  formStep?: string;
  step?: number;
  isOnboardingCompleted?: boolean;
  isServiceAgreementSubmitted?: boolean;
  isOnboardingRejected?: boolean;
  onboardingStatus?: OnboardingStatus;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: VerifyOtpData;
  errors: any[];
  timestamp: string;
}

export interface SavePhoneCkycRequest {
  ckycIdentifier: string;
  consentGiven: boolean;
}

export interface OnboardingStep {
  stepNumber: number;
  stepName: string;
  stepKey: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface OnboardingStatus {
  stepNumber: number;
  stepName: string;
  isCompleted: boolean;
  isOnboardingCompleted: boolean;
  isServiceAgreementSubmitted: boolean;
  isOnboardingRejected: boolean;
  steps: OnboardingStep[];
}

export interface SavePhoneCkycResponse {
  success: boolean;
  message: string;
  data: {
    mid: number;
    ckycIdentifier: string;
    consentGiven: boolean;
    token: string;
    tokenExpiration: string;
    message: string;
    formStep: string;
    step: number;
    isOnboardingCompleted: boolean;
    isServiceAgreementSubmitted: boolean;
    isOnboardingRejected: boolean;
    onboardingStatus: OnboardingStatus;
  };
  errors: any[];
  timestamp: string;
}

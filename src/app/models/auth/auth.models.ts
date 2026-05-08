export interface LoginRequest {
  email: string;
  password: string;
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
  steps: OnboardingStep[];
}

export interface LoginResponseData {
  token: string;
  expiration: string;
  email: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  firstName: string;
  lastName: string;
  refreshToken: string;
  refreshTokenExpiration: string;
  onboardingStatusId: number;
  currentStepName: string;
  formStep: string;
  step: number;
  onboardingStatus: OnboardingStatus;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
  errors: string[];
  timestamp: string;
}

export interface SendOtpRequest {
  mobileNumber: string;
  purpose: string;
}

export interface SendOtpData {
  success: boolean;
  message: string;
  remainingSeconds: number;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  data: SendOtpData;
  errors: string[];
  timestamp: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
}

export interface VerifyOtpData {
  token: string;
  expiration: string;
  email: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  firstName: string;
  lastName: string;
  refreshToken: string;
  refreshTokenExpiration: string;
  onboardingStatusId: number;
  currentStepName: string;
  formStep: string;
  step: number;
  onboardingStatus: OnboardingStatus;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: VerifyOtpData;
  errors: string[];
  timestamp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  expiredToken: string;
}

export interface RefreshTokenData {
  token: string;
  expiration: string;
  refreshToken: string;
  refreshTokenExpiration: string;
  email: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: RefreshTokenData;
  errors: string[];
  timestamp: string;
}

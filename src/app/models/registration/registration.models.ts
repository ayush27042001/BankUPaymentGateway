export interface RegistrationRequest {
  email: string;
  password: string;
  mobileNumber: string;
  companyWebsite: string;
  businessName: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data: {
    registrationToken: string;
    mobileNumber: string;
    otpExpirySeconds: number;
    message: string;
  };
  errors: any[];
  timestamp: string;
}

export interface RegistrationError {
  type: string;
  title: string;
  status: number;
  errors: {
    [key: string]: string[];
  };
  traceId: string;
}

export interface VerifyOtpRequest {
  mobileNumber: string;
  otp: string;
  registrationToken: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
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
    step: number;
  };
  errors: any[];
  timestamp: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    remainingSeconds: number;
    maxResendAttempts: number;
    remainingResendAttempts: number;
  };
  errors: any[];
  timestamp: string;
}

export interface ValidatePanResponse {
  success: boolean;
  message: string;
  data: {
    isValidFormat: boolean;
    isAlreadyRegistered: boolean;
    panNumber: string;
  };
  errors: any[];
  timestamp: string;
}

export interface VerifyPanCashfreeResponse {
  success: boolean;
  message: string;
  data: {
    isValid: boolean;
    panNumber: string;
    name: string;
    type: string;
    referenceId: number;
    message: string;
    nameMatches: boolean;
  };
  errors: any[];
  timestamp: string;
}

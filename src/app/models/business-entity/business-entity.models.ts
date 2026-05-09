export interface BusinessEntityType {
  businessEntityTypeId: number;
  entityName: string;
  description: string;
}

export interface BusinessEntityTypesResponse {
  success: boolean;
  message: string;
  data: BusinessEntityType[];
  errors: any[];
  timestamp: string;
}

export interface BusinessEntity {
  mid: number;
  businessEntityTypeId: number;
  entityName: string;
  description: string;
  isOnboardingCompleted?: boolean;
  isServiceAgreementSubmitted?: boolean;
  isOnboardingRejected?: boolean;
}

export interface BusinessEntityResponse {
  success: boolean;
  message: string;
  data: BusinessEntity;
  errors: any[];
  timestamp: string;
}

export interface SaveBusinessEntityRequest {
  businessEntityTypeId: number;
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

export interface SaveBusinessEntityResponse {
  success: boolean;
  message: string;
  data: {
    mid: number;
    businessEntityTypeId: number;
    entityName: string;
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

export interface SubCategory {
  businessSubCategoryId: number;
  businessCategoryId: number;
  subCategoryName: string;
  subCategoryCode: string;
}

export interface BusinessCategory {
  businessCategoryId: number;
  categoryName: string;
  categoryCode: string;
  description: string;
  subCategories: SubCategory[];
}

export interface BusinessCategoriesResponse {
  success: boolean;
  message: string;
  data: BusinessCategory[];
  errors: any[];
  timestamp: string;
}

export interface BusinessCategoryData {
  mid: number;
  businessCategoryId: number;
  categoryName: string;
  businessSubCategoryId: number;
  subCategoryName: string;
  isOnboardingCompleted?: boolean;
  isServiceAgreementSubmitted?: boolean;
  isOnboardingRejected?: boolean;
}

export interface BusinessCategoryResponse {
  success: boolean;
  message: string;
  data: BusinessCategoryData;
  errors: any[];
  timestamp: string;
}

export interface SaveBusinessCategoryRequest {
  businessCategoryId: number;
  businessSubCategoryId: number;
}

export interface SaveBusinessCategoryResponse {
  success: boolean;
  message: string;
  data: {
    mid: number;
    businessCategoryId: number;
    categoryName: string;
    businessSubCategoryId: number;
    subCategoryName: string;
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

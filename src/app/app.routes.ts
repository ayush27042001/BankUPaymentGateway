import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login'; // ✅ add this

import { PanVerificationComponent } from './pages/pan-verification/pan-verification';
import { BusinessEntityComponent } from './pages/business-entity/business-entity';
import { PhoneCkycComponent } from './pages/phone-ckyc/phone-ckyc';
import { BusinessCategoryComponent } from './pages/business-category/business-category';
import { ShareBusinessDetailsComponent } from './pages/share-business-details/share-business-details';
import { ConnectPlatformComponent } from './pages/connect-platform/connect-platform';
import { RegisterComponent } from './pages/register/register';
import { StatusTrackerComponent } from './pages/status-tracker/status-tracker';
import { OnboardingRejectedComponent } from './pages/onboarding-rejected/onboarding-rejected';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // ✅ default route → login
  { path: '', component: LoginComponent },

  // ✅ login route
  { path: 'login', component: LoginComponent },

  // ✅ register route (public)
  { path: 'register', component: RegisterComponent },

  // protected routes
  { path: 'pan-verification', component: PanVerificationComponent, canActivate: [authGuard] },
  { path: 'business-entity', component: BusinessEntityComponent, canActivate: [authGuard] },
  { path: 'phone-ckyc', component: PhoneCkycComponent, canActivate: [authGuard] },
  { path: 'business-category', component: BusinessCategoryComponent, canActivate: [authGuard] },
  { path: 'share-business-details', component: ShareBusinessDetailsComponent, canActivate: [authGuard] },
  { path: 'connect-platform', component: ConnectPlatformComponent, canActivate: [authGuard] },
  { path: 'status-tracker', component: StatusTrackerComponent, canActivate: [authGuard] },
  { path: 'onboarding-rejected', component: OnboardingRejectedComponent, canActivate: [authGuard] },

  // ✅ optional fallback (recommended)
  { path: '**', redirectTo: 'login' }
];
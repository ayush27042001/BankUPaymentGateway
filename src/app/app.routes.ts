import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login'; // ✅ add this

import { PanVerificationComponent } from './pages/pan-verification/pan-verification';
import { BusinessEntityComponent } from './pages/business-entity/business-entity';
import { PhoneCkycComponent } from './pages/phone-ckyc/phone-ckyc';
import { BusinessCategoryComponent } from './pages/business-category/business-category';
import { ShareBusinessDetailsComponent } from './pages/share-business-details/share-business-details';
import { ConnectPlatformComponent } from './pages/connect-platform/connect-platform';
import { RegisterComponent } from './pages/register/register';
export const routes: Routes = [
  // ✅ default route → login
  { path: '', component: LoginComponent },

  // ✅ login route
  { path: 'login', component: LoginComponent },

  // existing routes (same as yours)
  { path: 'pan-verification', component: PanVerificationComponent },
  { path: 'business-entity', component: BusinessEntityComponent },
  { path: 'phone-ckyc', component: PhoneCkycComponent },
  { path: 'business-category', component: BusinessCategoryComponent },
  { path: 'share-business-details', component: ShareBusinessDetailsComponent },
  { path: 'connect-platform', component: ConnectPlatformComponent },
  { path: 'register', component: RegisterComponent },

  // ✅ optional fallback (recommended)
  { path: '**', redirectTo: 'login' }
];
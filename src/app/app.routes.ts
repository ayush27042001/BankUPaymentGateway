import { Routes } from '@angular/router';
import { PanVerificationComponent } from './pages/pan-verification/pan-verification';
import { BusinessEntityComponent } from './pages/business-entity/business-entity';
import { PhoneCkycComponent } from './pages/phone-ckyc/phone-ckyc';
export const routes: Routes = [
  {
    path: '',
    component: PanVerificationComponent,
  },
   {
    path: 'business-entity',
    component: BusinessEntityComponent,
  },
  {
    path:'phone-ckyc',
    component:PhoneCkycComponent
  }
];
import { Routes } from '@angular/router';
import { PanVerificationComponent } from './pages/pan-verification/pan-verification';
import { BusinessEntityComponent } from './pages/business-entity/business-entity';
import { PhoneCkycComponent } from './pages/phone-ckyc/phone-ckyc';
import { BusinessCategoryComponent } from './pages/business-category/business-category';
import { ShareBusinessDetailsComponent } from './pages/share-business-details/share-business-details';
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
  },
   {
    path: 'business-category',
    component: BusinessCategoryComponent,
  },
  {
  path: 'share-business-details',
  component: ShareBusinessDetailsComponent
}
];
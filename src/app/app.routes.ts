// ==========================================
// app.routes.ts
// ==========================================

import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

import { PanVerificationComponent } from './pages/pan-verification/pan-verification';
import { BusinessEntityComponent } from './pages/business-entity/business-entity';
import { PhoneCkycComponent } from './pages/phone-ckyc/phone-ckyc';
import { BusinessCategoryComponent } from './pages/business-category/business-category';
import { ShareBusinessDetailsComponent } from './pages/share-business-details/share-business-details';
import { ConnectPlatformComponent } from './pages/connect-platform/connect-platform';

import { authGuard } from './guards/auth.guard';

import { AdminLayout } from './admin/layout/admin-layout/admin-layout';
import { Dashboard } from './admin/pages/dashboard/dashboard';
import { Users } from './admin/pages/users/users';
import { Merchants } from './admin/pages/merchants/merchants';

// ==========================================
// NEW IMPORT
// ==========================================

import { BusinessEntityTypes } from './admin/pages/business-entity-types/business-entity-types';
import { BusinessCategories } from './admin/pages/business-categories/business-categories';
import { BusinessSubCategories } from './admin/pages/business-sub-categories/business-sub-categories';
import { BusinessProofTypes } from './admin/pages/business-proof-types/business-proof-types';
import { PepStatus } from './admin/pages/pep-status/pep-status';
import { DocumentTypes } from './admin/pages/document-types/document-types';
export const routes: Routes = [

  {
    path: '',
    component: LoginComponent
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'pan-verification',
    component: PanVerificationComponent,
    canActivate: [authGuard]
  },

  {
    path: 'business-entity',
    component: BusinessEntityComponent,
    canActivate: [authGuard]
  },

  {
    path: 'phone-ckyc',
    component: PhoneCkycComponent,
    canActivate: [authGuard]
  },

  {
    path: 'business-category',
    component: BusinessCategoryComponent,
    canActivate: [authGuard]
  },

  {
    path: 'share-business-details',
    component: ShareBusinessDetailsComponent,
    canActivate: [authGuard]
  },

  {
    path: 'connect-platform',
    component: ConnectPlatformComponent,
    canActivate: [authGuard]
  },

  // ==========================================
  // ADMIN ROUTES
  // ==========================================

  {
    path: 'admin',
    component: AdminLayout,

    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'masters/users',
        component: Users
      },

      {
        path: 'merchants',
        component: Merchants
      },

      // ==========================================
      // BUSINESS ENTITY TYPES ROUTE
      // ==========================================

     {
  path: 'masters/business-entity-types',
  component: BusinessEntityTypes
},
{
  path: 'masters/business-categories',
  component: BusinessCategories
},
{
  path: 'masters/business-categories',
  component: BusinessCategories
},
{
  path: 'masters/business-sub-categories',
  component: BusinessSubCategories
},
{
  path: 'masters/business-proof-types',
  component: BusinessProofTypes
},
{
  path: 'masters/pep-status',
  component: PepStatus
},
{
  path: 'masters/document-types',
  component: DocumentTypes
},

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
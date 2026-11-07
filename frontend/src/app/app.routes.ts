import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard'; // <-- New
import { AccessDenied } from './components/access-denied/access-denied';
// Import your existing components
import { Login } from './components/login/login'; // <-- New
import { ForgotPassword } from './components/forgot-password/forgot-password'; // <-- New
import { ResetPassword } from './components/reset-password/reset-password'; // <-- New
import { Overview } from './components/overview/overview/overview';
import { SalesBilling } from './components/sales-billing/sales-billing/sales-billing';
import { Inventory } from './components/inventory/inventory/inventory';
import { Purchases } from './components/purchases/purchases/purchases';
import { Customers } from './components/customers/customers/customers';
import { Suppliers } from './components/suppliers/suppliers/suppliers';
import { Ledgers } from './components/ledgers/ledgers/ledgers';
import { Settings } from './components/settings/settings';
import { UnitMaster } from './components/masters/unit-master/unit-master';
import { CustomerMaster } from './components/masters/customer-master/customer-master';
import { CustomerForm } from './components/masters/customer-form/customer-form';
import { SupplierMaster } from './components/masters/supplier-master/supplier-master';
import { SupplierForm } from './components/masters/supplier-form/supplier-form';
import { ProductMaster } from './components/masters/product-master/product-master';
import { ProductForm } from './components/masters/product-form/product-form';
import { GstMaster } from './components/masters/gst-master/gst-master';
import { BankMaster } from './components/masters/bank-master/bank-master';
import { UserMaster } from './components/masters/user-master/user-master'; // <-- New

export const routes: Routes = [
  // 1. PUBLIC ROUTE (No Guard)
  { path: 'login', component: Login },
  {path: 'forgot-password', component: ForgotPassword},
  {path: 'reset-password', component: ResetPassword},

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
  
  // 2. PROTECTED ROUTES (Everyone must be logged in)
  { path: 'dashboard', component: Overview, canActivate: [AuthGuard] },
  { path: 'sales', component: SalesBilling, canActivate: [AuthGuard] },
  { path: 'inventory', component: Inventory, canActivate: [AuthGuard] },
  { path: 'purchases', component: Purchases, canActivate: [AuthGuard] },
  { path: 'customers', component: Customers, canActivate: [AuthGuard] },
  { path: 'suppliers', component: Suppliers, canActivate: [AuthGuard] },
  { path: 'ledgers', component: Ledgers, canActivate: [AuthGuard] },

  // 3. RESTRICTED ROUTES (Only Admin & Super Admin)
  { 
    path: 'settings', 
    component: Settings, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/units', 
    component: UnitMaster, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/customers', 
    component: CustomerMaster, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/customers/add', 
    component: CustomerForm, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/customers/edit/:id', 
    component: CustomerForm, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/suppliers', 
    component: SupplierMaster, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/suppliers/add', 
    component: SupplierForm, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/suppliers/edit/:id', 
    component: SupplierForm, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/products', 
    component: ProductMaster, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/products/add', 
    component: ProductForm, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/products/edit/:id', 
    component: ProductForm, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/gst', 
    component: GstMaster, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  { 
    path: 'masters/banks', 
    component: BankMaster, 
    canActivate: [AuthGuard], 
    data: { roles: ['super_admin', 'admin'] } 
  },
  {path: 'masters/users', component: UserMaster, canActivate: [AuthGuard], data: { roles: ['super_admin', 'admin'] } },
  // { 
  //   path: 'masters/users', 
  //   component: UserMaster, 
  //   canActivate: [AuthGuard], 
  //   data: { roles: ['super_admin', 'admin'] } 
  // },

  // 4. ACCESS DENIED PAGE
  { path: 'access-denied', component: AccessDenied, canActivate: [AuthGuard] },
  

  // Wildcard
  { path: '**', redirectTo: 'dashboard' }
];
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Modules/home/home.component';
import { CartComponent } from './Modules/cart/cart.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AccountComponent } from './Modules/account/account.component';
import { ProductComponent } from './Modules/product/product.component';
import { ProductDetailsComponent } from './Modules/product-details/product-details.component';
import { AddressComponent } from './Modules/address/address.component';
import { PaymentComponent } from './Modules/payment/payment.component';

const routes: Routes = [
  // Public login and register routes
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  // Public-facing modules (user website)
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'shop',
    component: ProductComponent,
  },
  {
    path: 'product-detail/:id',
    component: ProductDetailsComponent,
  },
  {
    path: 'account',
    component: AccountComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'address',
    component: AddressComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  // Catch-all route for public pages
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}

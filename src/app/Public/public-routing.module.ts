import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Modules/home/home.component';
import { ProductsComponent } from './Modules/products/products.component';
import { CategoriesComponent } from './Modules/categories/categories.component';
import { CartComponent } from './Modules/cart/cart.component';
import { ProfileComponent } from './Modules/profile/profile.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

const routes: Routes = [
  // Public login and register routes
  {
    path: 'home',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },

  // Public-facing modules (user website)
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  // Catch-all route for public pages
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild since it's a public feature module
  exports: [RouterModule]
})
export class PublicRoutingModule {}

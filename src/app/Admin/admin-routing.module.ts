import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './Modules/dashboard/dashboard.component';
import { ProductsComponent } from './Modules/products/products.component';
import { CategoriesComponent } from './Modules/categories/categories.component';
import { UsersComponent } from './Modules/users/users.component';
import { AuthGuard } from './auth/Services/auth.guard';
import { OrdersComponent } from './Modules/orders/orders.component';

const routes: Routes = [
  // Admin authentication route
  {
    path: 'login',
    component: AuthComponent,
  },
  // Admin layout and routes (protected)
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
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
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  // Catch-all route for any unknown paths
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Use forChild since it's an admin feature module
  exports: [RouterModule]
})
export class AdminRoutingModule {}

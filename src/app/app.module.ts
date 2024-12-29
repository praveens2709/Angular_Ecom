import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './Admin/admin.component';
import { PublicComponent } from './Public/public.component';
import { UsersComponent } from './Admin/Modules/users/users.component';
import { ProductsComponent } from './Admin/Modules/products/products.component';
import { CategoriesComponent } from './Admin/Modules/categories/categories.component';
import { AuthComponent } from './Admin/auth/auth.component';
import { HomeComponent } from './Public/Modules/home/home.component';
import { CartComponent } from './Public/Modules/cart/cart.component';
import { ProfileComponent } from './Public/Modules/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { DashboardComponent } from './Admin/Modules/dashboard/dashboard.component';
import { CardModule } from 'primeng/card';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { AvatarModule } from 'primeng/avatar';
import { BodyComponent } from './Admin/Modules/body/body.component';
import { SidenavComponent } from './Admin/Modules/sidenav/sidenav.component';
import { OrdersComponent } from './Admin/Modules/orders/orders.component';
import { RegisterComponent } from './Public/auth/register/register.component';
import { LoginComponent } from './Public/auth/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    PublicComponent,
    DashboardComponent,
    UsersComponent,
    ProductsComponent,
    CategoriesComponent,
    HomeComponent,
    CartComponent,
    ProfileComponent,
    AuthComponent,
    BodyComponent,
    SidenavComponent,
    OrdersComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    BrowserAnimationsModule,
    TableModule,
    CardModule,
    ChartModule,
    MultiSelectModule,
    DropdownModule,
    InputTextModule,
    TagModule,
    ProgressSpinnerModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    RatingModule,
    DialogModule,
    SidebarModule,
    AvatarModule
  ],
  providers: [
    MessageService,
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

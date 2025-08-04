import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { ProfileComponent } from './profile/profile.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [
  { path: 'login',canActivate:[LoginGuard], component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'products/:status', component: ProductsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'orders/:status', component: OrdersComponent },
      { path: 'users', component: UsersComponent }, 
      { path: 'users/:status', component: UsersComponent }, 
      {path:'profile',component:ProfileComponent},
      {path:'category',component:CategoriesComponent},
      {path:'category/:status',component:CategoriesComponent}
    ],
  },
  { path: 'forget-password',canActivate:[LoginGuard], component: ForgetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

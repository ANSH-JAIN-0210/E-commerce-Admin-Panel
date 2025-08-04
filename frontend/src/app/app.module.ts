import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import {
  MatDrawerContainer,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { UsersComponent } from './users/users.component';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatPaginator } from '@angular/material/paginator';
import { ProfileComponent } from './profile/profile.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EditAdminDialogComponent } from './admin-dialog/admin-dialog.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { ProductDialogComponent } from './product-dialog/product-dialog.component';
import { CategoriesComponent } from './categories/categories.component';
import { MatSelectModule } from '@angular/material/select';
import { CategoriesDialogComponent } from './categories-dialog/categories-dialog.component';
import { MatOptionModule } from '@angular/material/core';
import { DropdownSearchPipe } from './pipe/dropdown-search.pipe';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { MatCheckbox } from '@angular/material/checkbox';
import { ChartComponent } from './chart/chart.component';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    ProductsComponent,
    OrdersComponent,
    UsersComponent,
    ForgetPasswordComponent,
    LayoutComponent,
    ProfileComponent,
    EditAdminDialogComponent,
    UserDialogComponent,
    ProductDialogComponent,
    CategoriesComponent,
    CategoriesDialogComponent,
    DropdownSearchPipe,
    GenericTableComponent,
    OrderDialogComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatSlideToggle,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    NgIf,
    MatSidenavModule,
    MatDrawerContainer,
    MatError,
    MatPaginator,
    MatIconModule,
    MatTooltipModule,
    MatExpansionModule,
    MatCheckbox,
    HighchartsChartModule
  ],
  providers: [
    DatePipe,
    HttpClient,
    provideHttpClient(
      withInterceptors([TokenInterceptor])
    ),
    provideClientHydration(withEventReplay())
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

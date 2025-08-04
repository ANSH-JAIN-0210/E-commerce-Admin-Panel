import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) {}
  user: any;
  product: any;
  category: any;
  order: any;

  navigate(path: string) {
    this.router.navigate([path]);
  }
  getUserDetails() {
    this.dashboardService.getUserDetails().subscribe({
      next: (response) => {
        console.log(response);
        this.user = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCategoryDetails() {
    this.dashboardService.getCategoryDetails().subscribe({
      next: (response) => {
        console.log(response);
        this.category = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getOrderDetails() {
    this.dashboardService.getOrderDetails().subscribe({
      next: (response) => {
        console.log(response);
        this.order = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getProductDetails() {
    this.dashboardService.getProductDetails().subscribe({
      next: (response) => {
        console.log(response);
        this.product = response;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnInit(): void {
    this.getUserDetails();
    this.getCategoryDetails();
    this.getOrderDetails();
    this.getProductDetails();
  }
  nav_Users(status:string){
    this.router.navigate(['users',status])
  }
  nav_products(status:string){
    this.router.navigate(['products',status])
  }
  nav_orders(status:string){
    this.router.navigate(['orders',status])
  }
  nav_categories(status:string){
    this.router.navigate(['category',status])
  }

}

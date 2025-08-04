import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OrderDialogComponent } from '../order-dialog/order-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  constructor(
    private orderService: OrderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route:ActivatedRoute
  ) {}
  response: any;

  pageSize = 10;
  pageIndex = 0;
  totalOrders = 0;

  orderColumns = [
    { key: 'orderId', label: 'Order ID', type: 'text' },
    { key: 'user.name', label: 'User Name', type: 'text' },
    { key: 'user.email', label: 'User Email', type: 'text' },
    { key: 'products.length', label: 'Products Count', type: 'text' },
    { key: 'totalPrice', label: 'Total Price', type: 'text' },
    { key: 'status', label: 'status', type: 'text' },
    { key: 'paymentMethod', label: 'Payment Method', type: 'text' },
    { key: 'shippingAddress.city', label: 'City', type: 'text' },
    { key: 'shippingAddress.state', label: 'State', type: 'text' },
    { key: 'orderedAt', label: 'Ordered At', type: 'date' },
  ];

  search = {
    orderId:'',
    status:'',
    paymentMethod:'',
  }

  ngOnInit(): void {
     this.route.paramMap.subscribe((paramMap) => {
      const status = paramMap.get('status');
      this.search.status = status || '';
      this.pageIndex = 0;
      this.getOrders();
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getOrders();
  }
  
  getOrders() {
    const currentPage = this.pageIndex + 1;
    this.orderService.getOrders(currentPage,JSON.stringify(this.search)).subscribe({
      next: (res) => {
        this.response = res;
        console.log('orders:', this.response);
        this.totalOrders = this.response?.pagination?.total || 0;
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'Error Fetching orders',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }
  openEditUserDialog(id: number, orders: any) {
    const dialogRef = this.dialog.open(OrderDialogComponent, {
      width: '450px',
      data: {
        status: orders?.status,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(id)
        this.orderService.editOrders(id, result).subscribe({
          next: () => {
            this.getOrders();
            this.snackBar.open('Order edited successfully', 'Close', {
              duration: 3000,
            });
          },
          error: (err) => {
            this.snackBar.open(
              err.error?.message || 'Error editing order',
              'Close',
              { duration: 3000 }
            );
          },
        });
      }
    });
  }
}

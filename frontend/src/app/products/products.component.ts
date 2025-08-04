import { Component, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductDialogComponent } from '../product-dialog/product-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  constructor(
    private ProductService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private route: ActivatedRoute
  ) {}

  response: any;
  pageSize = 10;
  pageIndex = 0;
  totalProducts = 0;
  categoryList: any;
  categoryFilter: string = '';
  categoryControl = new FormControl();
  selectedField: string = '';

  selectedFields: string[] = [
    'productId',
    'name',
    'description',
    'category.name',
    'price',
    'status',
    'imageUrl',
  ];

  productColumns = [
    { key: 'productId', label: 'Product ID', type: 'text' },
    { key: 'name', label: 'Product Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'category.name', label: 'Category', type: 'text' },
    { key: 'price', label: 'Price', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'imageUrl', label: 'Image', type: 'text' },
    { key: 'createdAt', label: 'Date of Creation', type: 'date' },
    { key: '_id', label: 'Object ID', type: 'text' },
    { key: 'deleted', label: 'Deleted Status', type: 'text' },
    { key: 'category.status', label: 'Category status', type: 'text' },
  ];

  search = {
    productId: '',
    name: '',
    category: '',
    status: '',
  };
  categories: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getFilteredProductcolumns(): any[] {
    return this.productColumns.filter((col) =>
      this.selectedFields.includes(col.key)
    );
  }
  getLabel(key: any): string | null {
    const column = this.productColumns.find((col) => col.key === key);
    return column?.label || null;
  }
  onFieldSelectionChange() {
    this.productColumns.forEach((col) => {
      this.selectedFields.includes(col.key);
    });
    console.log(this.selectedFields);
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const status = paramMap.get('status');
      this.search.status = status || '';
      this.pageIndex = 0;
      this.getProducts();
    });
    this.getCategories();
    this.getCategoryList();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getProducts();
  }

  getProducts() {
    const currentPage = this.pageIndex + 1;
    console.log(this.search);
    this.ProductService.getProducts(currentPage, this.search).subscribe({
      next: (data) => {
        this.response = data;
        this.totalProducts = data?.total || 0;
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'Error fetching products',
          'Close',
          { duration: 3000 }
        );
      },
    });
  }

  searchProduct() {
    this.pageIndex = 0;
    this.getProducts();
  }

  clearFilters() {
    this.search = {
      productId: '',
      name: '',
      category: '',
      status: '',
    };
    this.pageIndex = 0;
    this.getProducts();
  }

  delete(id: number) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '350px',
      data: {
        mode: 'delete',
        data: { _id: id },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?._deleted) {
        this.ProductService.deleteProduct(id).subscribe({
          next: () => {
            console.log('products', this.response);
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000,
            });
            this.getProducts();
          },
          error: (err) => {
            this.snackBar.open(
              err.error?.message || 'Error deleting product',
              'Close',
              { duration: 3000 }
            );
          },
        });
      } else {
        this.snackBar.open('Delete cancelled', 'Close', { duration: 3000 });
      }
    });
  }

  OpenAddUserDialog() {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '450px',
      data: {
        mode: 'add',
        data: {
          name: '',
          description: '',
          categoryName: '',
          price: null,
          image: '',
          status: 'active',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ProductService.addProduct(result).subscribe({
          next: () => {
            this.snackBar.open('Product added successfully', 'Close', {
              duration: 3000,
            });
            this.getProducts();
          },
          error: (err) => {
            this.snackBar.open(
              err.error?.message || 'Error adding product',
              'Close',
              { duration: 3000 }
            );
          },
        });
      }
    });
  }

  openEditUserDialog(id: number, products: any) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '450px',
      data: {
        mode: 'edit',
        data: {
          name: products?.name,
          description: products?.description,
          categoryName: products?.category?.name,
          price: products?.price,
          image: products?.image,
          status: products?.status,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ProductService.editProduct(id, result).subscribe({
          next: () => {
            this.getProducts();
            this.snackBar.open('Product edited successfully', 'Close', {
              duration: 3000,
            });
          },
          error: (err) => {
            this.snackBar.open(
              err.error?.message || 'Error editing product',
              'Close',
              { duration: 3000 }
            );
          },
        });
      }
    });
  }
  getCategories() {
    this.ProductService.getCategories().subscribe({
      next: (data) => {
        console.log(data);
        this.categories = data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getCategoryList() {
    this.categoryService.fetchCategoryList().subscribe({
      next: (data) => {
        this.categoryList = data;
        console.log(this.categoryList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onDropdownOpen(opened: boolean) {
    if (opened) {
      this.categoryFilter = '';
    }
  }
}

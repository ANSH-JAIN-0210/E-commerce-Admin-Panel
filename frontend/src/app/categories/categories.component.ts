import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { PageEvent } from '@angular/material/paginator';
import { CategoriesDialogComponent } from '../categories-dialog/categories-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: false,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}
  response: any;
  pageSize = 10;
  pageIndex = 0;
  totalCategories = 0;
  search = {
    categoryId: '',
    name: '',
    status: '',
  };
  categoryList: any;
  categoryFilter: string = '';
  categoryControl = new FormControl();
  selectedField: string = '';

  selectedFields: string[] = [
    'categoryId',
    'name',
    'description',
    'status',
    'productCount',
  ];

  categoryColumns = [
    { key: 'categoryId', label: 'Category ID', type: 'text' },
    { key: 'name', label: 'Category Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'productCount', label: 'Product Count', type: 'text' },
    { key: '_id', label: 'Object ID', type: 'text' },
    { key: 'createdAt', label: 'Date of Creation', type: 'date' },
  ];

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getCategories();
  }

  getFilteredCategorycolumns(): any[] {
    return this.categoryColumns.filter((col) =>
      this.selectedFields.includes(col.key)
    );
  }
  getLabel(key: any): string | null {
    const column = this.categoryColumns.find((col) => col.key === key);
    return column?.label || null;
  }
  onFieldSelectionChange() {
    this.categoryColumns.forEach((col) => {
      this.selectedFields.includes(col.key);
    });
    console.log(this.selectedFields);
  }

  getCategories() {
    const currentPage = this.pageIndex + 1;
    console.log(this.search);
    this.categoryService
      .getCategories(currentPage, JSON.stringify(this.search))
      .subscribe({
        next: (data) => {
          this.response = data?.data;
          console.log('categories: ', this.response);
          this.totalCategories = data?.pagination.total || 0;
          
          console.log(this.totalCategories);
          console.log(data);
        },
        error: (error) => {
          this.snackBar.open(
            error.error?.message || 'Error fetching categories',
            'Close',
            { duration: 3000 }
          );
          console.log(error);
        },
      });
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      const status = paramMap.get('status');
      this.search.status = status || '';
      this.pageIndex = 0;
      this.getCategories();
    });
    // this.getCategories();
    this.getCategoryList();
  }
  openEditDialog(data: any) {
    const dialogRef = this.dialog.open(CategoriesDialogComponent, {
      width: '500px',
      data: {
        mode: 'edit',
        data: {
          name: data?.name,
          description: data?.description,
          status: data?.status,
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.categoryService.editCategory(data?._id, result).subscribe({
        next: (data) => {
          this.getCategories();
        },
        error: (err) => {
          this.snackBar.open(
            err.error?.message || 'Error Editing Category',
            'Close',
            { duration: 3000 }
          );
        },
      });
    });
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CategoriesDialogComponent, {
      width: '400px',
      data: {
        mode: 'add',
        data: {
          name: '',
          description: '',
        },
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      this.categoryService.addCategory(result).subscribe({
        next: (data) => {
          console.log(data);
          this.getCategories();
          this.snackBar.open('Category Added Successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          this.snackBar.open(
            err.error?.message || 'Error adding category',
            'Close',
            { duration: 3000 }
          );
        },
      });
    });
  }
  openDeleteDialog(id: number) {
    console.log(id);
    const dialogRef = this.dialog.open(CategoriesDialogComponent, {
      width: '350px',
      data: {
        mode: 'delete',
        data: { _id: id },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      if (result?._deleted) {
        this.categoryService.deleteCategory(id).subscribe({
          next: () => {
            this.snackBar.open('Product deleted successfully', 'Close', {
              duration: 3000,
            });
            this.getCategories();
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
        this.snackBar.open('Delete cancelled', 'Close', {
          duration: 3000,
        });
      }
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

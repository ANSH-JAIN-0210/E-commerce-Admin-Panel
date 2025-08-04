import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrl: './product-dialog.component.css',
  standalone: false,
})
export class ProductDialogComponent implements OnInit {
  mode: 'add' | 'edit' | 'delete';
  data: any;
  showDeleteConfirmation = false;
  categories: any;

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { mode: 'add' | 'edit' | 'delete'; data: any },
    private categoryService: CategoryService
  ) {
    this.mode = dialogData.mode;
    this.data = dialogData.data;
  }
  categoryList: any;
  categoryFilter: string = '';
  categoryControl = new FormControl();

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

  closeDialog() {
    this.dialogRef.close();
  }

  requestDeleteConfirmation() {
    this.showDeleteConfirmation = true;
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
  }

  confirmDelete() {
    this.dialogRef.close({ ...this.data, _deleted: true });
  }

  ngOnInit() {
    this.getCategoryList();
  }
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.data.image = file;
    }
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriesComponent } from '../categories/categories.component';

@Component({
  selector: 'app-categories-dialog',
  templateUrl: './categories-dialog.component.html',
  styleUrl: './categories-dialog.component.css',
  standalone: false,
})
export class CategoriesDialogComponent {
  mode: 'add' | 'edit' | 'delete';
  data: any;
  showDeleteConfirmation = false;

  constructor(
    public dialogRef: MatDialogRef<CategoriesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { mode: 'add' | 'edit' | 'delete'; data: any }
  ) {
    this.mode = dialogData.mode;
    this.data = dialogData.data;
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
}

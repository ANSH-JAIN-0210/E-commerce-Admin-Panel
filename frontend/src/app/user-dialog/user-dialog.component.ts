import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";


@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.css',
  standalone:false
})
export class UserDialogComponent {
  mode: 'add' | 'edit' | 'delete';
  data: any;
  showDeleteConfirmation = false;
  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogData: { mode: 'add' | 'edit' | 'delete'; data: any },
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

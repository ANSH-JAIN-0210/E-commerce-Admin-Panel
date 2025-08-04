import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-dialog',
  templateUrl: './admin-dialog.component.html',
  styleUrl: './admin-dialog.component.css',
  standalone:false
})
export class EditAdminDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}

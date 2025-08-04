import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-dialog',
  standalone: false,
  templateUrl: './order-dialog.component.html',
  styleUrl: './order-dialog.component.css',
})
export class OrderDialogComponent {
  public data: any;

  constructor(
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) injectedData: any
  ) {
    this.data = injectedData;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}

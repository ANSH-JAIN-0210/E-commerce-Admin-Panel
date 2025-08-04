import { Component } from '@angular/core';
import { AdminService } from '../services/profile.service';
import { MatDialog } from '@angular/material/dialog';
import { EditAdminDialogComponent } from '../admin-dialog/admin-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  editMode = false;
  adminData: any;
  name: string = '';
  email: string = '';

  constructor(
    private AdminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  openEditDialog() {
    const dialogRef = this.dialog.open(EditAdminDialogComponent, {
      data: {
        name: this.name,
        email: this.email,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.name = result.name;
        this.email = result.email;
        this.submit();
      }
    });
  }

  ngOnInit() {
    this.getAdmin();
  }

  getAdmin() {
    this.AdminService.getAdminProfile().subscribe({
      next: (AdminData) => {
        this.adminData = AdminData;
        this.name = AdminData.admin.name;
        this.email = AdminData.admin.email;
        console.log('Admin data fetched:', AdminData);
      },
      error: (error) => {
        console.error('Error fetching admin data:', error);
      },
    });
  }

  edit() {
    this.editMode = !this.editMode;
  }

  submit() {
    const data = {
      name: this.name,
      email: this.email,
    };
    console.log('Submitting admin data:', data);

    this.AdminService.editAdminProfile(data).subscribe({
      next: (AdminData) => {
        this.adminData = AdminData;
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
        });
        this.getAdmin();
      },
      error: (error) => {
        this.snackBar.open(error.error?.message, 'Close', {
          duration: 3000,
        });
        console.error(error);
      },
    });
  }
}

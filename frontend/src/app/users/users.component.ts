import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UserService } from '../services/user.service';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: false,
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  response: any;
  pageSize = 10;
  pageIndex = 0;
  totalUsers = 0;
  editUserId: number | null = null;
  payload: any = {
    userId: '',
    name: '',
    email: '',
    status: '',
    gender: '',
  };
  selectedField: string = '';

  selectedFields: string[] = [
    'userId',
    'name',
    'email',
    'dob',
    'gender',
    'status',
    'createdAt',
  ];

  userColumns = [
    { key: '__v', label: 'V ID', type: 'text' },
    { key: '_id', label: 'Object ID', type: 'text' },
    { key: 'updatedAt', label: 'Updated Date', type: 'date' },
    { key: 'userId', label: 'User ID', type: 'text' },
    { key: 'name', label: 'User Name', type: 'text' },
    { key: 'email', label: 'Description', type: 'text' },
    { key: 'dob', label: 'DOB', type: 'date' },
    { key: 'gender', label: 'Gender', type: 'text' },
    { key: 'status', label: 'Status', type: 'text' },
    { key: 'createdAt', label: 'Created At', type: 'date' },
  ];

  selectedStatus = 'All';
  searchErrorMessage = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const status = paramMap.get('status');
      this.payload.status = status || '';
      this.pageIndex = 0;
      this.getUsers();
    });
  }

  getFilteredUserColumns(): any[] {
    return this.userColumns.filter((col) =>
      this.selectedFields.includes(col.key)
    );
  }

  getUsers() {
    const currentPage = this.pageIndex + 1;
    this.userService
      .getUsers(currentPage, JSON.stringify(this.payload))
      .subscribe({
        next: (userData) => {
          this.response = userData;
          this.totalUsers = userData.totalCount || userData?.totalUsers || 0;
          this.searchErrorMessage = '';
        },
        error: (error) => {
          this.searchErrorMessage = 'Failed to fetch users.';
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getUsers();
  }

  getLabel(key: any): string {
    const column = this.userColumns.find((col) => col.key === key);
    return column ? column.label : key;
  }
  onFieldSelectionChange() {
    this.userColumns.forEach((col) => {
      this.selectedFields.includes(col.key);
    });
    console.log(this.selectedFields);
  }
  OpenAddUserDialog() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        mode: 'add',
        data: {
          name: '',
          email: '',
          password: '',
          gender: '',
          dob: '',
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (
        result &&
        result.name &&
        result.email &&
        result.password &&
        result.gender &&
        result.dob
      ) {
        const newUser = {
          name: result.name,
          email: result.email,
          password: result.password,
          gender: result.gender,
          dob: result.dob,
        };
        this.userService.addUser(newUser).subscribe({
          next: (response) => {
            console.log('User added successfully:', response);
            this.snackBar.open(response.message || 'User added', 'Close', {
              duration: 3000,
            });
            this.getUsers();
          },
          error: (error) => {
            console.error('Error adding user:', error);
            this.snackBar.open(
              error.error?.message || 'Failed to add user',
              'Close',
              {
                duration: 3000,
              }
            );
          },
        });
      } else {
        console.log('Add user dialog closed without action.');
      }
    });
  }

  deleteUser(id: number) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '350px',
      data: {
        mode: 'delete',
        data: {
          _id: id,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?._deleted) {
        this.userService.deleteUser(id).subscribe({
          next: (data) => {
            console.log('User deleted:', data);
            this.snackBar.open('User deleted successfully!', 'Close', {
              duration: 3000,
            });
            this.getUsers();
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.snackBar.open(
              error.error?.message || 'Failed to delete user',
              'Close',
              {
                duration: 3000,
              }
            );
          },
        });
      } else {
        this.snackBar.open('Delete cancelled', 'Close', { duration: 3000 });
        console.log('Delete cancelled');
      }
    });
  }

  editUser(user: any) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        mode: 'edit',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          gender: user.gender,
          dob: user.dob,
          status: user.status,
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?._deleted) {
        this.deleteUser(user._id);
      } else if (result) {
        const updatedUser = {
          _id: result._id,
          name: result.name,
          email: result.email,
          status: result.status,
          gender: result.gender,
          dob: result.dob,
        };
        this.updateUser(updatedUser);
      } else {
        console.log('Edit user dialog closed without changes.');
      }
    });
  }

  updateUser(user: any) {
    this.userService.editUserProfile(user).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        this.snackBar.open('User updated successfully!', 'Close', {
          duration: 3000,
        });
        this.getUsers();
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open(error.error?.message, 'Close', {
          duration: 3000,
        });
      },
    });
  }

  updateSearchResults(res: any) {
    this.response = res;
    this.totalUsers = res.totalUsers || 0;
    this.searchErrorMessage = '';
  }

  handleSearchError(err: any) {
    console.log('Search error:', err.error.message);
    this.response = null;
    this.totalUsers = 0;
    this.searchErrorMessage = 'No user found.';
  }
}

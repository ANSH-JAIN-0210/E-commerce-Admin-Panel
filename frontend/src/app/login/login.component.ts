import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoginService } from '../services/login-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  loginForm: FormGroup;
  emailerrorMessage = '';
  pwderrorMessage = '';
  errormsg = '';
  hide = true;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private snackbar: MatSnackBar
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });

    merge(
      this.loginForm.get('email')!.statusChanges,
      this.loginForm.get('email')!.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      this.emailerrorMessage = 'You must enter an email';
    } else if (emailControl?.hasError('email')) {
      this.emailerrorMessage = 'Not a valid email format';
    } else {
      this.emailerrorMessage = '';
    }
  }
  updatePasswordErrorMessage() {
    const pwdControl = this.loginForm.get('password');
    if (pwdControl?.hasError('required')) {
      this.pwderrorMessage = 'You must enter a Password';
    } else if (pwdControl?.value?.length < 6) {
      this.pwderrorMessage = 'Password must be at least 6 characters';
    } else {
      this.pwderrorMessage = '';
    }
  }

  submit() {
    this.updateErrorMessage();
    this.updatePasswordErrorMessage();

    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      this.loginService.login({ email, password }).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Login successful:', response);
            localStorage.setItem('token', response.token);
            this.router.navigate(['']);
            this.snackbar.open('Logged in Successfully', 'Close', {
              duration: 3000,
            });
          } else {
            this.errormsg = response.message || 'Invalid login';
          }
        },
        error: (error) => {
          this.snackbar.open(
            error.error?.message || 'Failed to Login',
            'Close',
            {
              duration: 3000,
            }
          );
          this.errormsg = error.error.message || 'Something went wrong';
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  reset() {
    this.router.navigate(['/forget-password']);
  }
}

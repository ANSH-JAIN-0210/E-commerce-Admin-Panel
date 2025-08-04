import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../services/reset-password.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
  standalone: false,
})
export class ForgetPasswordComponent {
  forgotPasswordForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      otp: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{6}$/),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: ForgetPasswordComponent.passwordsMatchValidator }
  );

  hideNewPassword = true;
  hideConfirmPassword = true;
  step = 1;

  emailErrorMessage = '';
  otpErrorMessage = '';
  newPasswordErrorMessage = '';
  confirmPasswordErrorMessage = '';

  constructor(private authService: AuthService, private router: Router,private snackBar : MatSnackBar) {}

  static passwordsMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  get email() {
    return this.forgotPasswordForm.get('email')!;
  }
  get otp() {
    return this.forgotPasswordForm.get('otp')!;
  }
  get newPassword() {
    return this.forgotPasswordForm.get('newPassword')!;
  }
  get confirmPassword() {
    return this.forgotPasswordForm.get('confirmPassword')!;
  }
  login() {
    this.router.navigate(['login']);
  }

  sendOtp() {
    if (this.email.invalid) {
      this.updateErrorMessages();
      return;
    }
    const emailControl = this.forgotPasswordForm.get('email');
    if (!emailControl) {
      this.emailErrorMessage = 'Email control not found';
      return;
    }
    this.authService.sendForgotPasswordOtp(this.email.value!).subscribe({
      next: (res) => {
        console.log('OTP sent:', res);
        this.step = 2;
        this.snackBar.open('OTP sent successful', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error Sending OTP', 'Close', {
          duration: 3000,
        });
        console.error('Error sending OTP:', err);
      },
    });
  }

  resetPassword() {
    if (this.forgotPasswordForm.invalid) {
      this.updateErrorMessages();
      return;
    }

    const data = {
      email: this.email.value!,
      otp: this.otp.value!,
      password: this.newPassword.value!,
    };

    this.authService.resetPassword(data).subscribe({
      next: (res) => {
        console.log('Password reset success:', res);
        this.router.navigate(['']);
        this.step = 1;
        this.snackBar.open('Password reset successful', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'Password reset failed',
          'Close',
          {
            duration: 3000,
          }
        );
        console.error('Reset failed:', err);
      },
    });
  }

  private updateErrorMessages() {
    this.emailErrorMessage = this.email.hasError('required')
      ? 'Email is required'
      : this.email.hasError('email')
      ? 'Enter a valid email'
      : '';

    this.otpErrorMessage = this.otp.hasError('required')
      ? 'OTP is required'
      : this.otp.hasError('pattern')
      ? 'OTP must be 6 digits'
      : '';

    this.newPasswordErrorMessage = this.newPassword.hasError('required')
      ? 'Password is required'
      : this.newPassword.hasError('minlength')
      ? 'Password must be at least 6 characters'
      : '';

    this.confirmPasswordErrorMessage = this.confirmPassword.hasError('required')
      ? 'Confirm password is required'
      : this.forgotPasswordForm.hasError('passwordMismatch')
      ? 'Passwords do not match'
      : '';
  }
}

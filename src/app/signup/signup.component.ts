import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signUpForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar, //will show messages to the user
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(4)]],
      confirmPassword: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  togglePasswordVisiblity() {
    this.hidePassword = !this.hidePassword;
  }

  onsubmit(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    const password = this.signUpForm.get('password')?.value;
    const confirmPassword = this.signUpForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.snackBar.open('Passwords do not match.', 'close', {
        duration: 3000,
        panelClass: 'error-snackbar',
      });
      return;
    }

    this.authService.register(this.signUpForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('Sign up successful!', 'Close', { duration: 4000 });
        void this.router.navigateByUrl('/login');
      },

      error: (error) => {
        this.snackBar.open('Sign up failed. Please try again.', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }
}

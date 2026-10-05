import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { SignUpRequest } from '../models/auth.model';

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
    private snackBar: MatSnackBar,
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
      this.snackBar.open('Passwords do not match.', 'Close', {
        duration: 3000,
        panelClass: 'error-snackbar', //CSS
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      return;
    }

    const signUpRequest: SignUpRequest = {
      name: this.signUpForm.get('name')?.value,
      email: this.signUpForm.get('email')?.value,
      password: this.signUpForm.get('password')?.value,
    };

    this.authService.register(signUpRequest).subscribe({
      next: (response) => {
        this.snackBar.open('Sign Up Successful!', 'Close', { duration: 3000 });
        void this.router.navigateByUrl('/login');
      },

      error: (error) => {
        this.snackBar.open('Sign Up failed. Please try again.', 'Close', {
          duration: 3000,
          panelClass: 'error-snackbar',
        });
      },
    });
  }
}

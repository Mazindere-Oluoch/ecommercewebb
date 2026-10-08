import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserStorageService } from '../services/storage/userstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userStorageService: UserStorageService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(4)]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.snackBar.open('Log In Successful!', '', {
          duration: 2000,
          verticalPosition: 'bottom'
        });

        //next runs when observable produces a value
        this.userStorageService.saveToken(response.token);
        this.userStorageService.saveUser(response);

        if (response.role === 'ADMIN') {
          void this.router.navigateByUrl('/admin/dashboard'); //todo sth about promises
        } else if (response.role === 'CUSTOMER') {
          void this.router.navigateByUrl('/customer/dashboard');
        }
      }, //TODO impl route guards later

      error: () => {
        //runs when observable produces an error
        // can we get backend msg?
        this.snackBar.open('Bad credentials', 'ERROR', {
          duration: 5000,
        });
      },
    });
  }
}

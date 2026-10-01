import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserstorageService } from '../services/auth/storage/userstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  //get user's form values, call authService, save login, navigate

  loginForm!: FormGroup;
  hidePassword = true; // by default the password should be hidden

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userStorageService: UserstorageService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    const email = this.loginForm.get('email')!.value;
    const password = this.loginForm.get('password')!.value;

    this.authService.login(email, password).subscribe({
      next: (response) => { //next runs when observable produces a value
        this.userStorageService.saveToken(response.token);
        this.userStorageService.saveUser(response);

        if (response.role === 'ADMIN') {
          void this.router.navigateByUrl('/admin/dashboard'); //todo sth about promises
        } else if(response.role === 'CUSTOMER') {
         void this.router.navigateByUrl('/customer/dashboard');
        }
      },  //TODO impl route guards later

      error: () => { //runs when observable produces an error
        // can we get backend msg?
        this.snackBar.open('Bad credentials', 'ERROR', {
          duration: 5000,
        });
      },
    });
  }
}

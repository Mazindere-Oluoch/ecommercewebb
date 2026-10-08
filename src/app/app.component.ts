import { Component } from '@angular/core';
import { UserStorageService } from './services/storage/userstorage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ecommerceweb';

  isCustomerLoggedIn: boolean = this.userStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = this.userStorageService.isAdminLoggedIn();

  constructor(
    private router: Router,
    private userStorageService: UserStorageService,
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      this.isCustomerLoggedIn = this.userStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = this.userStorageService.isAdminLoggedIn();
    });
  }

  logout() {
    this.userStorageService.signOut();
    this.router.navigateByUrl('login');
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserstorageService {
  constructor() {}

  // todo wat do readonly mean?
  private readonly TOKEN = 'ecom-token';
  private readonly USER = 'ecom-user';

  saveToken(token: string | null): void {
    localStorage.setItem(this.TOKEN, token);
  }

  saveUser(user: any): void {
    localStorage.setItem(this.USER, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN);
  }

  getUser(): any | null {
    const user = localStorage.getItem(this.USER);
    return user ? JSON.parse(user) : null;
  }

  getUserId(): number | null {
    return this.getUser()?.userId ?? null; //optional chaining & nullish coalescing
  }

  getUserRole(): string | null {
    return this.getUser()?.role ?? null;
  }

  isAdminLoggedIn(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isCustomerLoggedIn(): boolean {
    return this.getUserRole() === 'CUSTOMER';
  }

  signOut(): void {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem(this.USER);
  }
}

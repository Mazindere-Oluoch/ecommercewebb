import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../../models/login.model';

const BASIC_URL = 'http://localhost:8083/api/v1/auth';
@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(private http: HttpClient) {}

  register(signupRequest: any): Observable<any> {
    //signup interface/dto?
    return this.http.post(BASIC_URL + '/sign-up', signupRequest);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(BASIC_URL + '/login', body);
  }
}

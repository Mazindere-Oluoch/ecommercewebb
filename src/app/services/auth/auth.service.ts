import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse, SignUpResponse, SignUpRequest } from '../../models/auth.model';

const BASIC_URL = 'http://localhost:8083/api/v1/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(signupRequest: SignUpRequest): Observable<SignUpResponse> {
    return this.http.post<SignUpResponse>(BASIC_URL + '/sign-up', signupRequest);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const body = { email, password };
    return this.http.post<LoginResponse>(BASIC_URL + '/login', body);
  }
}

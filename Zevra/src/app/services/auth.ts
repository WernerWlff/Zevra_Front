import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  message?: string;
}

const TOKEN_KEY = 'zevra_token';
const USER_KEY= 'zevra_user';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private env: EnvironmentService) {
    this.baseUrl = this.env.apiUrl;
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, data);
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password });
  }

  setSession(res: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, res.token);
    const user = {
      id: res.id,
      username: res.username,
      email: res.email,
      firstname: res.firstname,
      lastname: res.lastname,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getUser(): {id: string, username: string, email: string, firstname: string, lastname: string } | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw): null;
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  updateStoredUser(data: { firstname: string; lastname: string; username: string; email: string }): void {
    const user = this.getUser();
    if (!user) return;
    const updated = { ...user, ...data };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
  }

  //todo : updatePassword
}

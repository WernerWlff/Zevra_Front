import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    private env: EnvironmentService
  ) {
    this.baseUrl = this.env.apiUrl;
  }

  login(email:string, password:string): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  register(data: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  updatePassword(data: unknown): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/password`, data);
  }

  getAllUsers(): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/user`);
  }

  getUserById(id: string): Observable<unknown> {
    return this.http.get(`${this.baseUrl}/user/${id}`);
  }

  createUser(user: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/user`, user);
  }

  updateUser(id: string, data: unknown): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/user/${id}`, data);
  }

  deleteUser(id: string): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/user/${id}`);
  }
}

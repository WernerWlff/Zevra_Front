import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from './role';

export interface user {
  id: number,
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
  role_id: Role,
  create_at: Date,
  updated_at: Date

}

@Injectable({
  providedIn: 'root',
})

export class User {
  private apiUrl = "./api/users"

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user`);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/${id}`);
  }

  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user`, user);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${id}`);
  }
}

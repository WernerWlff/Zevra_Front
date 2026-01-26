import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment';
import { Observable } from 'rxjs';

export interface Type {
  id: number;
  category: string;
}

@Injectable({
  providedIn: 'root',
})

export class TypeService {
  private readonly baseUrl: string;
  
  constructor(private http: HttpClient, private env: EnvironmentService) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllTypes(): Observable<Type[]> {
    return this.http.get<Type[]>(`${this.baseUrl}/types`);
  }
}

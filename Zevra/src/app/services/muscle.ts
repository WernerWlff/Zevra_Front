import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment';
import { Observable } from 'rxjs';

export interface Muscle {
  id: number;
  muscleTargeted: string;
  area: string;
}

@Injectable({
  providedIn: 'root',
})
export class MuscleService {
  private readonly baseUrl: string;
  
  constructor(private http: HttpClient, private env: EnvironmentService) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllMuscles(): Observable<Muscle[]> {
    return this.http.get<Muscle[]>(`${this.baseUrl}/muscles`);
  }
}

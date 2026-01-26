import { Injectable } from '@angular/core';
import { Type } from './type';
import { Muscle } from './muscle';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment';
import { Observable } from 'rxjs';

export interface Exercice {
  id: number;
  type: Type;
  muscle: Muscle;
  duration: string;
  beginner_rep: number;
  intermediate_rep: number;
  hard_rep: number;
  created_at: Date;
  updated_at: Date;

}

export interface CreateExerciceRequest {
  type_id: number;
  muscle_id: number;
  duration: string;
  beginner_rep?: number;
  intermediate_rep?: number;
  hard_rep?: number;
}

export interface UpdateExerciceRequest {
  type_id?: number;
  muscle_id?: number;
  duration?: string;
  beginner_rep?: number;
  intermediate_rep?: number;
  hard_rep?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ExerciceService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private env: EnvironmentService) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllExercices(): Observable<Exercice[]> {
    return this.http.get<Exercice[]>(`${this.baseUrl}/exercices`);
  }

  getExerciceById(id: number): Observable<Exercice> {
    return this.http.get<Exercice>(`${this.baseUrl}/exercices/${id}`);
  }

  createExercice(request: CreateExerciceRequest): Observable<Exercice> {
    return this.http.post<Exercice>(`${this.baseUrl}/exercices`, request);
  }

  updateExercice(id: number, request: UpdateExerciceRequest): Observable<Exercice> {
    return this.http.put<Exercice>(`${this.baseUrl}/exercices/${id}`, request);
  }

  deleteExercice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/exercices/${id}`);
  }
}
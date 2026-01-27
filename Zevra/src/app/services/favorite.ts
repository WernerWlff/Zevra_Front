import { Injectable } from '@angular/core';
import { User } from './user';
import { Exercice } from './exercice';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment';
import { Observable } from 'rxjs';

export interface Favorite {
  id: number;
  name: string;
  description: string;
  user: User;
  exercice: Exercice;
  created_at: Date;
  updated_at: Date;
}

export interface AddExerciceToFavoriteRequest {
  exercice_id: number;
  name: string;
  description?: string;
}

export interface FavoriteResponse {
  id: number;
  exerciceId: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  exerciceType?: string;
  exerciceMuscle?: string;
}

@Injectable({
  providedIn: 'root',
})

export class FavoriteService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private env: EnvironmentService) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.baseUrl}/favorites`);
  }

  getFavoriteById(id: number): Observable<Favorite> {
    return this.http.get<Favorite>(`${this.baseUrl}/favorites/${id}`);
  }

  getFavoritesByUser(userId: string): Observable<FavoriteResponse[]> {
    return this.http.get<FavoriteResponse[]>(`${this.baseUrl}/favorites/user/${userId}`);
  }

  addExerciceToFavorite(userId: string, request: AddExerciceToFavoriteRequest): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.baseUrl}/favorites/user/${userId}/exercices`, request);
  }

  deleteFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/favorites/${id}`);
  }

  removeExerciceFromFavorite(userId: string, exerciceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/favorites/user/${userId}/exercice/${exerciceId}`);
  }
}

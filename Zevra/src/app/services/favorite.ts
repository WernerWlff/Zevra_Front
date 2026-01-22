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

@Injectable({
  providedIn: 'root',
})

export class FavoriteService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private env: EnvironmentService) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.baseUrl}/api/favorites`);
  }

  getFavoriteById(id: number): Observable<Favorite> {
    return this.http.get<Favorite>(`${this.baseUrl}/api/favorites/${id}`);
  }

  getFavoritesByUser(userId: string): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.baseUrl}/api/favorites/user/${userId}`);
  }

  addExerciceToFavorite(userId: string, request: AddExerciceToFavoriteRequest): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.baseUrl}/api/favorites/user/${userId}/exercices`, request);
  }

  deleteFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/favorites/${id}`);
  }

  removeExerciceFromFavorite(userId: string, exerciceId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/api/favorites/user/${userId}/exercice/${exerciceId}`);
  }
}

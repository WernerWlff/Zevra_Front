import { Injectable } from '@angular/core';
import { User } from './user';
import { Exercice } from './exercice';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from './environment';
import { Observable } from 'rxjs';

// TODO: finish to implement User ( Date Object )
export interface TrainingList {
  id: number;
  name: string;
  description?: string;
  user: User;
  exercice: Exercice;
  created_at: Date;
  updated_at: Date;
}

export interface AddExerciceToTrainingListRequest {
  exercice_id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})

export class TrainingListService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient, private env: EnvironmentService) {
    this.baseUrl = this.env.apiUrl;
  }

  getAllTrainingLists(): Observable<TrainingList[]> {
    return this.http.get<TrainingList[]>(`${this.baseUrl}/api/training-lists`);
  }

  getTrainingListById(id: number): Observable<TrainingList> {
    return this.http.get<TrainingList>(`${this.baseUrl}/api/training-lists/${id}`);
  }

  getTrainingListsByUser(userId: string): Observable<TrainingList[]> {
    return this.http.get<TrainingList[]>(`${this.baseUrl}/api/training-lists/user/${userId}`);
  }

  getListNamesByUser(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/api/training-lists/user/${userId}/names`);
  }

  getExercicesByListName(userId: string, listName: string): Observable<TrainingList[]> {
    return this.http.get<TrainingList[]>(`${this.baseUrl}/api/training-lists/user/${userId}/list/${listName}`);
  }

  addExerciceToTrainingList(userId: string, request: AddExerciceToTrainingListRequest): Observable<TrainingList> {
    return this.http.post<TrainingList>(`${this.baseUrl}/api/training-lists/user/${userId}/exercices`, request);
  }

  updateTrainingList(id: number, trainingList: TrainingList): Observable<TrainingList> {
    return this.http.put<TrainingList>(`${this.baseUrl}/api/training-lists/${id}`, trainingList);
  }

  deleteTrainingList(id: number): Observable<{ message : string }> {
    return this.http.delete<{ message : string }>(`${this.baseUrl}/api/training-lists/${id}`);
  }
  
  removeExerciceFromList(userId: string, listName: string, exerciceId: number): Observable<{ message : string }> {
    return this.http.delete<{ message : string }>(`${this.baseUrl}/api/training-lists/user/${userId}/list/${listName}/exercice/${exerciceId}`);
  }

  deleteEntireList(userId: string, listName: string): Observable<{ message : string }> {
    return this.http.delete<{ message : string }>(`${this.baseUrl}/api/training-lists/user/${userId}/list/${listName}`);
  }


}

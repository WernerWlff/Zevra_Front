import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  get apiUrl(): string {
    return (environment as { apiUrl: string }).apiUrl;
  }

  get backendUrl(): string {
    return (environment as { backendUrl: string }).backendUrl;
  }

  get backendPort(): number {
    return (environment as { backendPort: number }).backendPort;
  }
}
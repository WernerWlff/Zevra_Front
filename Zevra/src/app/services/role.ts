import { Injectable } from '@angular/core';

export interface Role {
  id: number,
  permission: string
}

@Injectable({
  providedIn: 'root',
})

export class Role {
  private apiUrl = "./api/roles";
}

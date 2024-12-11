//engage.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface EngageResponse {
  data: {
    id: number;
    big_idea: string;
    essential_question: string;
    challenge: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EngageService {
  private apiUrl = 'http://localhost:8000/api/engage';  // URL da API Django

  constructor(private http: HttpClient) { }

  createEngage(engageData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, engageData);
  }

  getEngageData(): Observable<EngageResponse> {
    console.log('Getting engage data');
    console.log(this.apiUrl);
    return this.http.get<EngageResponse>(this.apiUrl);
  }
  
}

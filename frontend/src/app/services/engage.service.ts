import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';  // Importando Observable

@Injectable({
  providedIn: 'root'
})
export class EngageService {
  private apiUrl = 'http://localhost:8000'; // Endpoint atualizado

  constructor(private http: HttpClient, private authService: AuthService, private router: Router ) { }

  // createEngage(engageData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}`, engageData);
  // }
  createOrUpdateEngage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/engage/create/`, data);
  }

  getEngage(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/engage/`);
  }

  createPage(phase: string, projectId: number): Observable<any> {
    const token = this.authService.getToken(); // Obter o token do AuthService
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`,
    });

    const body = {
      phase: phase,
      project_id: projectId,
    };
    
    console.log('Enviando dados para criar página:', body);

    return this.http.post(`${this.apiUrl}/pages/create/`, body, { headers });
  }
  

  // updateEngage(id: number, data: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}/`, data);
  // }
}

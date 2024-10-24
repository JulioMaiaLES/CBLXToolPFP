// project.service.ts
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = 'http://localhost:8000/api/projects/create/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createProject(projectData: { name: string; email: string }): Observable<any> {
    const token = this.authService.getToken(); // Certifique-se de pegar o token armazenado
    if (!token) {
      throw new Error('Usuário não autenticado. Token ausente.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`, // ou `Bearer ${token}`, dependendo da configuração no backend
    });
    
    return this.http.post(this.baseUrl, projectData, { headers });
    
  }
}

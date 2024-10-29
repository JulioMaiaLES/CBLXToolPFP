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
  private createUrl = 'http://localhost:8000/api/projects/create/';
  private listUrl = 'http://localhost:8000/api/projects/user-projects/'; // Novo endpoint para listar projetos

  constructor(private http: HttpClient, private authService: AuthService) {}

  createProject(projectData: { name: string; email: string }): Observable<any> {
    const token = this.authService.getToken();
    console.log('Token:', token);  // Verifica o token
    console.log('Project data:', projectData);  // Verifica os dados do projeto

    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
    });
    
    return this.http.post(this.createUrl, projectData, { headers });
}


  getUserProjects(): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Token ausente.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });

    return this.http.get(this.listUrl, { headers });
  }
}

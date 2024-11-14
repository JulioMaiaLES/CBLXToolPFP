// project.service.ts
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private createUrl = 'http://localhost:8000/api/projects/create/';
  private apiUrl = 'http://localhost:8000/api/projects';
  private storageKey = 'currentProjectId';
  private projectsKey = 'userProjects';

  constructor(private http: HttpClient, private authService: AuthService, private router: Router ) {}

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

    return this.http.get(`${this.apiUrl}/user-projects/`, { headers });
  }

  setCurrentProject(projectId: number): void {
    console.log('Definindo projeto atual no localStorage:', projectId);
    localStorage.setItem('currentProjectId', projectId.toString());
  }

  getCurrentProjectId(): number | null {
    const projectId = localStorage.getItem('currentProjectId');
    return projectId ? parseInt(projectId) : null;
  }


  // Salva todos os projetos no localStorage
  saveProjects(projects: any[]): void {
    localStorage.setItem(this.projectsKey, JSON.stringify(projects));
  }

  // Obtém o projeto pelo ID a partir do localStorage
  getProjectById(projectId: number): any {
    const projects = JSON.parse(localStorage.getItem(this.projectsKey) || '[]');
    return projects.find((project: any) => project.id === projectId);
  }

    // Busca um projeto pelo ID do banco de dados
  getProjectDetails(projectId: number): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Token ausente.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`,
    });

    return this.http.get(`${this.apiUrl}/details/${projectId}/`, { headers });
  }


}

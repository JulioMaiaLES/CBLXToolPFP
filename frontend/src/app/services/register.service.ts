// register.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:8000/user';  // Altere para o URL do seu backend Django

  constructor(private http: HttpClient) {}

  // Método para registrar um novo usuário
  register_user(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }
}

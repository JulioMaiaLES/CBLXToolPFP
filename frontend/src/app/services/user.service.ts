// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private profileUrl = 'http://localhost:8000/api/user/profile/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserProfile(): Observable<any> {
    const token = this.authService.getToken();  // Recupera o token armazenado

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`  // Adiciona o token ao cabeçalho
    });

    return this.http.get<any>(this.profileUrl, { headers });
  }
}
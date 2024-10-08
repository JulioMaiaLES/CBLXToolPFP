import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  // Importando Observable

@Injectable({
  providedIn: 'root'
})
export class EngageService {
  private apiUrl = 'http://localhost:8000'; // Endpoint atualizado

  constructor(private http: HttpClient) { }

  // createEngage(engageData: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}`, engageData);
  // }
  createOrUpdateEngage(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/engage/create/`, data);
  }

  getEngage(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/engage/`);
  }

  // updateEngage(id: number, data: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}/`, data);
  // }
}

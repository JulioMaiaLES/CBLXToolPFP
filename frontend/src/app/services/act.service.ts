import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActService {
  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) { }

  createEngage(actData: any){
    return this.http.post(`${this.apiUrl}/act/`, actData);
  }
}

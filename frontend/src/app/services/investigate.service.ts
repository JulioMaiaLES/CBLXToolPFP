import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvestigateService {
  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) { }

  createInvestigate(investigateData: any){
    return this.http.post(`${this.apiUrl}/investigate/`, investigateData);
  }
}

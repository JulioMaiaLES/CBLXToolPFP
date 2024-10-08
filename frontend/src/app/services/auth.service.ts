//auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IToken, IUser } from '@models/user';
import { Md5 } from 'md5-typescript';
import { CookieService } from 'ngx-cookie-service';
import { BodyJson, HttpService } from './http.service';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpService,
    private cookieService: CookieService,
    private storage: StorageService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<any> {
    const loginData = { email: email, password: password };
    console.log("Sending login data:", loginData);  // Apenas para debug, remover em produção
    console.log("Email", email, "Password", password);  // Apenas para debug, remover em produção
    return this.http.post<IToken>(`${this.apiUrl}/auth-user/`, loginData);
  }
  

  private apiUrl = 'http://localhost:8000/usuario';


  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }
  

  getMe() {
    return this.http.get<IUser>('core/get-user/');
  }

  get ssl() {
    return location.protocol === 'https:';
  }

  /**
   * Função para setar o token no cookie
   * @param token Token que vem da API
   * @param keep Se true, o cookie expira em 60 dias, se false, o cookie expira quando o browser é fechado
   * @return void
   *
   * @author Kauã Landi
   */
  setToken(token: string, keep = false): void {
    if (this.storage.cookies) {
      this.cookieService.set(
        'token',
        token,
        keep ? 60 : undefined,
        '/',
        undefined,
        this.ssl,
        'Strict'
      );
    } else {
      sessionStorage.setItem('token', token);
    }
  }

  logout() {
    this.setToken('', false);
    this.router.navigate(['/login']);
  }

  forgotPassword(email: string) {
    return this.http.post('core/forgot-password/', { email });
  }

  rescurePassword(body: BodyJson) {
    body['new_password'] = Md5.init(body['new_password']).toUpperCase();
    return this.http.post('core/change-password-forgot-password/', body);
  }
}

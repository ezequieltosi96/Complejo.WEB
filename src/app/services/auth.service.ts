import { EventEmitter, Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AuthenticationRequest } from '../models/auth/authentication-request';
import { AuthenticationResponse } from '../models/auth/authentication-response';
import { RegistrationRequest } from '../models/auth/registration-request';
import { RegistrationResponse } from '../models/auth/registration-response';
import { decodeToken } from '../models/security/jwt-decode';
import { JwtTokenDescriptor } from '../models/security/jwt-token-descriptor';
import { UserContext } from '../models/security/user-context';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public Logged: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private apiService: ApiService) { }

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.apiService.post<AuthenticationResponse>('auth/authenticate', request);
  }

  register(request: RegistrationRequest): Observable<RegistrationResponse> {
    return this.apiService.post<RegistrationResponse>('auth/register', request);
  }

  setSession(token: string): void {
    const decoded: JwtTokenDescriptor = decodeToken(token);

    const expirationDateTime = decoded.exp * 1000;

    const expiresAt = expirationDateTime.toString();

    localStorage.setItem('id_token', token);
    localStorage.setItem('expires_at', expiresAt);

    this.Logged.emit(this.isLoggedIn());
  }

  terminateSession(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    
    this.Logged.emit(this.isLoggedIn());
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('id_token') !== null && 
           localStorage.getItem('expires_at') !== null && 
           !this.isTokenExpired();
  }

  getUserContext(): UserContext | undefined {
    if(this.isLoggedIn()) {
      const token = localStorage.getItem('id_token');
      return new UserContext(token!);
    }

    return undefined;
  }

  getCurrentToken(): string | undefined {
    return localStorage.getItem('id_token')!;
  }

  isTokenExpired() {
    const expiration = localStorage.getItem('expires_at');

    if(expiration) {
      const expiresAt = Number(expiration);

      var currentTime = new Date().getTime();

      return currentTime > expiresAt;
    }

    return true;
  }
}

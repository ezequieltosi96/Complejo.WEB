import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const token = this.authService.getCurrentToken();

    if(token) {
      const clonedRequest = request.clone({
        headers: request.headers.append("Authorization", `Bearer ${token}`)
      });

      return next.handle(clonedRequest);
    }

    return next.handle(request);
  }
}
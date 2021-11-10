import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequestHeadersService } from './request-headers.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  postBegin = new EventEmitter();
  postEnd = new EventEmitter();

  private apiURL: string = 'https://localhost:44376/api';

  constructor(private readonly httpClient: HttpClient,
              private readonly requestHeadersService: RequestHeadersService) { }

  get<T>(prefix: string): Observable<T> {
    return this.httpClient.get<T>(`${this.apiURL}/${prefix}`, this.requestHeadersService.apply());
  }

  getById<T>(prefix: string, id: string): Observable<T>{
    return this.httpClient.get<T>(`${this.apiURL}/${prefix}/${id}`, this.requestHeadersService.apply());
  }

  post<T>(prefix: string, objectToPost: any): Observable<T> {
    this.postBegin.emit();
    return this.httpClient.post<T>(`${this.apiURL}/${prefix}`, JSON.stringify(objectToPost), this.requestHeadersService.apply())
      .pipe(
        catchError(err => {
          this.postEnd.emit();
          return this.handleError(err);
        }),
        map(obs => {
          this.postEnd.emit();
          return obs;
        })
      );
  }

  put<T>(prefix: string, objectToPut: any): Observable<T> {
    return this.httpClient.put<T>(`${this.apiURL}/${prefix}`, JSON.stringify(objectToPut), this.requestHeadersService.apply());
  }

  delete(prefix: string, id: string): Observable<Object> {
    return this.httpClient.delete(`${this.apiURL}/${prefix}/${id}`, this.requestHeadersService.apply());
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

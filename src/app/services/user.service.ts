import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateAdminUserCommand } from '../gateway/commands/user/create-admin-user.command';
import { ResetPasswordCommand } from '../gateway/commands/user/reset-password.command';
import { GetUserByFilterQuery } from '../gateway/querys/user/user-by-filter.query';
import { PagedListResponse } from '../models/responses/paged-list-response';
import { UserByFilter } from '../models/user/user-by-filter';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly prefix: string = 'user';

  constructor(private readonly apiService: ApiService) { }

  //#region Commands

  CreateUser(command: CreateAdminUserCommand): Observable<number> {
    return this.apiService.post<number>(this.prefix, command);
  }

  DeleteUser(id: string): Observable<object> {
    return this.apiService.delete(this.prefix, id);
  }

  ResetPassword(command: ResetPasswordCommand): Observable<object> {
    const url = `${this.prefix}/reset-password`;
    return this.apiService.post<object>(url, command);
  }

  //#endregion

  GetUserByFilter(query: GetUserByFilterQuery): Observable<PagedListResponse<UserByFilter[]>> {
    const url = `${this.prefix}/by-filter${query.getParams()}`;
    return this.apiService.get<PagedListResponse<UserByFilter[]>>(url);
  }
}

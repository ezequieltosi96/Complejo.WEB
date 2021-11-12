import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUserCommand } from '../gateway/commands/user/create-user.command';
import { UpdateUserCommand } from '../gateway/commands/user/update-user.command';
import { GetUserByFilterQuery } from '../gateway/querys/user/user-by-filter.query';
import { PagedListResponse } from '../models/responses/paged-list-response';
import { User } from '../models/user/user';
import { UserByFilter } from '../models/user/user-by-filter';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly prefix: string = 'user';

  constructor(private readonly apiService: ApiService) { }

  //#region Commands

  CreateUser(command: CreateUserCommand): Observable<number> {
    return this.apiService.post<number>(this.prefix, command);
  }

  UpdateUser(command: UpdateUserCommand): Observable<number> {
    return this.apiService.put<number>(this.prefix, command);
  }

  DeleteUser(id: string): Observable<object> {
    return this.apiService.delete(this.prefix, id);
  }

  //#endregion

  GetUserByFilter(query: GetUserByFilterQuery): Observable<PagedListResponse<UserByFilter[]>> {
    const url = `${this.prefix}/by-filter${query.getParams()}`;
    return this.apiService.get<PagedListResponse<UserByFilter[]>>(url);
  }

  GetUserById(id: string): Observable<User> {
    return this.apiService.getById<User>(this.prefix, id);
  }
}

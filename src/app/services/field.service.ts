import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateFieldCommand } from '../gateway/commands/field/create-field.command';
import { UpdateFieldCommand } from '../gateway/commands/field/update-field.command';
import { GetAllFieldStatusQuery } from '../gateway/querys/field/all-field-status.query';
import { GetAllFieldTypeQuery } from '../gateway/querys/field/all-field-type.query';
import { GetFieldByFilterQuery } from '../gateway/querys/field/field-by-filter.query';
import { FieldByFilter } from '../models/field/field-by-filter';
import { FieldById } from '../models/field/field-by-id';
import { ComboBox } from '../models/responses/combo-box';
import { PagedListResponse } from '../models/responses/paged-list-response';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  private readonly prefix: string = 'field';

  constructor(private readonly apiService: ApiService) { }

  //#region Commands

  CreateField(command: CreateFieldCommand): Observable<string> {
    return this.apiService.post<string>(this.prefix, command);
  }

  UpdateField(command: UpdateFieldCommand): Observable<string> {
    return this.apiService.put<string>(this.prefix, command);
  }

  DeleteField(id: string): Observable<object> {
    return this.apiService.delete(this.prefix, id);
  }

  //#endregion


  //#region Queries

  GetFieldByFilter(query: GetFieldByFilterQuery): Observable<PagedListResponse<FieldByFilter[]>> {
    const url = `${this.prefix}/by-filter${query.getParams()}`;
    return this.apiService.get<PagedListResponse<FieldByFilter[]>>(url);
  }

  GetFieldById(id: string): Observable<FieldById> {
    return this.apiService.getById<FieldById>(this.prefix, id);
  }

  GetAllFieldStatus(query: GetAllFieldStatusQuery): Observable<ComboBox[]> {
    const url = `${this.prefix}/all-field-status${query.getParams()}`;
    return this.apiService.get<ComboBox[]>(url);
  }

  GetAllFieldType(query: GetAllFieldTypeQuery): Observable<ComboBox[]> {
    const url = `${this.prefix}/all-field-type${query.getParams()}`;
    return this.apiService.get<ComboBox[]>(url);
  }

  //#endregion
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GetAllTurnsByClientQuery } from 'src/app/gateway/querys/turn/all-turns-by-client.query';
import { Metadata } from 'src/app/models/responses/metadata';
import { PagedListResponse } from 'src/app/models/responses/paged-list-response';
import { TurnByClient } from 'src/app/models/turn/turn-by-client';
import { TurnByFilter } from 'src/app/models/turn/turn-by-filter';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { TurnService } from 'src/app/services/turn.service';
import { ActionTable } from 'src/app/shared/generic-table/models/action-table';
import { ColumnTable } from 'src/app/shared/generic-table/models/column-table';
import { Pagination } from 'src/app/shared/utils/enums.utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public year: number = new Date().getFullYear();

  public turns: TurnByClient[] = [];
  public metadata: Metadata | undefined;
  public columns: ColumnTable[] = [];

  public id!: string;

  public page: number = Pagination.PAGE;
  public size: number = 6;

  public loading: boolean = true;

  constructor(private readonly bService: BaseComponentService,
              private readonly turnService: TurnService,
              private readonly authService: AuthService) { }

  ngOnInit(): void {
    this.startLoading();

    this.id = this.authService.getUserContext()?.idClient!;

    this.initTurnTable();

    this.search(this.page);
  }

  initTurnTable() {
    this.columns = [
      {title: 'Código', dataProperty: 'code'},
      {title: 'Fecha', dataProperty: 'date'},
      {title: 'Hora', dataProperty: 'time'},
      {title: 'Tipo', dataProperty: 'fieldType'},
      {title: 'Cancha', dataProperty: 'field'},
    ];
  }

  searchByPage(page: number): void {
    this.startLoading();

    this.search(page);
  }

  search(page: number): void {
    this.turns = [];
    this.metadata = undefined;
    this.turnSearchObservable(page).subscribe(
      res => {
        this.turns = res.data;
        this.metadata = res.metadata;
        if(this.turns.length === 0){
          this.bService.toastr.info('No hay turnos para mostrar');
        }
      },
      err => {
        let error = this.bService.handleErrorMessage(err);
        this.bService.toastr.error(error.message, error.title);
      }
    ).add(() => this.stopLoading());
  }

  turnSearchObservable(page: number): Observable<PagedListResponse<TurnByClient[]>> {
    let query: GetAllTurnsByClientQuery = new GetAllTurnsByClientQuery(this.id, page, this.size);

    return this.turnService.GetAllTurnsByClient(query);
  }

  private startLoading(){
    this.bService.spinner.show();
    this.loading = true;
  }

  private stopLoading(){
    this.bService.spinner.hide();
    this.loading = false;
  }
}

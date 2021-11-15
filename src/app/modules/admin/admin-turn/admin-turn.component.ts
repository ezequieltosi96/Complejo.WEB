import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GetAllFieldTypeQuery } from 'src/app/gateway/querys/field/all-field-type.query';
import { GetTurnByFilterQuery } from 'src/app/gateway/querys/turn/turn-by-filter.query';
import { ComboBox } from 'src/app/models/responses/combo-box';
import { Metadata } from 'src/app/models/responses/metadata';
import { PagedListResponse } from 'src/app/models/responses/paged-list-response';
import { TurnByFilter } from 'src/app/models/turn/turn-by-filter';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { FieldService } from 'src/app/services/field.service';
import { TurnService } from 'src/app/services/turn.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ActionTable } from 'src/app/shared/generic-table/models/action-table';
import { ColumnTable } from 'src/app/shared/generic-table/models/column-table';
import { FontAwesome, Pagination } from 'src/app/shared/utils/enums.utils';

@Component({
  selector: 'app-admin-turn',
  templateUrl: './admin-turn.component.html',
  styleUrls: ['./admin-turn.component.css']
})
export class AdminTurnComponent implements OnInit {

  public turns: TurnByFilter[] = [];

  public metadata: Metadata | undefined;
  public columns: ColumnTable[] = [];
  public actions: ActionTable[] = [];

  public fieldTypes: ComboBox[] = [];
  public times: ComboBox[] = [];

  public page: number = Pagination.PAGE;
  public size: number = Pagination.PAGE_SIZE;

  public loading: boolean = true;

  public FontAwesome = FontAwesome;

  public searchForm: FormGroup = this.bService.formBuilder.group({
    clientSearchCriteria: [''],
    date: [''],
    time: [''],
    idFieldType: ['']
  });

  constructor(private readonly bService: BaseComponentService,
              private readonly turnService: TurnService,
              private readonly fieldService: FieldService) { }

  ngOnInit(): void {
    this.startLoading();

    this.initTurnTable();

    let promises: Promise<void>[] = [];

    promises.push(this.getAllFieldTypeByFieldPromise());
    promises.push(this.getAllValidTimesPromise());

    this.resolvePromises(promises);
  }

  resolvePromises(promises: Promise<void>[]){
    Promise.all(promises)
      .then(() => this.search(this.page, null, null, null, null));
  }

  getAllFieldTypeByFieldPromise() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.fieldService.GetAllFieldType(new GetAllFieldTypeQuery(null)).subscribe(
        res => {
          this.fieldTypes = res;
          resolve();
        },
        err => {
          this.fieldTypes = [];
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
          reject();
        }
      );
    });
  }

  getAllValidTimesPromise() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.turnService.GetValidTimesForReservation().subscribe(
        res => {
          this.times = res;
          resolve();
        },
        err => {
          this.times = [];
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
          reject();
        }
      );
    });
  }

  initTurnTable() {
    this.columns = [
      {title: 'Código', dataProperty: 'code'},
      {title: 'Fecha', dataProperty: 'date'},
      {title: 'Hora', dataProperty: 'time'},
      {title: 'Cancha', dataProperty: 'field'},
      {title: 'Cliente', dataProperty: 'clientName'},
    ];

    this.actions = [
      {name: 'Delete', click: (item) => this.deleteTurn(item), icon: FontAwesome.DELETE},
    ];
  }

  editTurn(item: any) {
    this.bService.router.navigate([`/admin/turns/edit/${item.id}`]);
  }

  deleteTurn(item: any) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = false;
    config.autoFocus = false;
    config.maxWidth = '70%';
    config.width = '450px';
    config.data = {
      title: 'Eliminar turno',
      body: `¿Esta seguro que quiere eliminar el turno ${item.code}?`
    }

    this.bService.matDialog.open(ConfirmDialogComponent, config).afterClosed().subscribe(
      res => {
        if (res.confirm){
          this.startLoading();
          this.turnService.DeleteTurn(item.id).subscribe(
            resp => {
              this.bService.toastr.success('Turno eliminado', 'Éxito!');
              this.search(this.page, null, null, null, null);
            },
            err => {
              let error = this.bService.handleErrorMessage(err);
              this.bService.toastr.error(error.message, error.title);
              this.stopLoading();
            }
          );
        }
      }
    );
  }

  resetFilters() {
    this.searchForm.patchValue({
      clientSearchCriteria: [''],
      date: [''],
      time: [''],
      idFieldType: ['']
    });

    this.search(this.page, null, null, null, null);
  }

  searchInit(): void {
    this.startLoading();

    this.search(this.page, 
                this.searchForm.value.date ? this.searchForm.value.date : null,
                this.searchForm.value.idFieldType ? this.searchForm.value.idFieldType : null,
                this.searchForm.value.time ? this.searchForm.value.time : null,
                this.searchForm.value.clientSearchCriteria ? this.searchForm.value.clientSearchCriteria : null);
  }

  searchByPage(page: number): void {
    this.startLoading();

    this.search(page, 
                this.searchForm.value.date ? this.searchForm.value.date : null,
                this.searchForm.value.idFieldType ? this.searchForm.value.idFieldType : null,
                this.searchForm.value.time ? this.searchForm.value.time : null,
                this.searchForm.value.clientSearchCriteria ? this.searchForm.value.clientSearchCriteria : null);
  }

  search(page: number, date: Date | null, idFieldType: string | null, time: string | null, clientSearchCriteria: string | null): void {
    this.turns = [];
    this.metadata = undefined;
    this.turnSearchObservable(page, date, idFieldType, time, clientSearchCriteria).subscribe(
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

  turnSearchObservable(page: number, date: Date | null, idFieldType: string | null, time: string | null, clientSearchCriteria: string | null): Observable<PagedListResponse<TurnByFilter[]>> {
    let query: GetTurnByFilterQuery = new GetTurnByFilterQuery(date, time, idFieldType, clientSearchCriteria, page, this.size);

    return this.turnService.GetTurnByFilter(query);
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

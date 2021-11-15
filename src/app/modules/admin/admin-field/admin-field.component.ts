import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GetAllFieldStatusQuery } from 'src/app/gateway/querys/field/all-field-status.query';
import { GetAllFieldTypeQuery } from 'src/app/gateway/querys/field/all-field-type.query';
import { GetFieldByFilterQuery } from 'src/app/gateway/querys/field/field-by-filter.query';
import { FieldByFilter } from 'src/app/models/field/field-by-filter';
import { ComboBox } from 'src/app/models/responses/combo-box';
import { Metadata } from 'src/app/models/responses/metadata';
import { PagedListResponse } from 'src/app/models/responses/paged-list-response';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { FieldService } from 'src/app/services/field.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ActionTable } from 'src/app/shared/generic-table/models/action-table';
import { ColumnTable } from 'src/app/shared/generic-table/models/column-table';
import { FontAwesome, Pagination } from 'src/app/shared/utils/enums.utils';

@Component({
  selector: 'app-admin-field',
  templateUrl: './admin-field.component.html',
  styleUrls: ['./admin-field.component.css']
})
export class AdminFieldComponent implements OnInit {

  public fields: FieldByFilter[] = [];

  public metadata: Metadata | undefined;
  public columns: ColumnTable[] = [];
  public actions: ActionTable[] = [];

  public fieldStatus: ComboBox[] = [];
  public fieldTypes: ComboBox[] = [];

  public page: number = Pagination.PAGE;
  public size: number = Pagination.PAGE_SIZE;

  public loading: boolean = true;

  public FontAwesome = FontAwesome;

  public searchForm: FormGroup = this.bService.formBuilder.group({
    description: [''],
    idFieldStatus: [''],
    idFieldType: ['']
  });

  constructor(private readonly bService: BaseComponentService,
              private readonly fieldService: FieldService) { }

  ngOnInit(): void {
    this.startLoading();

    this.initFieldTable();

    let promises: Promise<void>[] = [];

    promises.push(this.getAllFieldStatusByFieldPromise());
    promises.push(this.getAllFieldTypeByFieldPromise());

    this.resolvePromises(promises);
  }

  resolvePromises(promises: Promise<void>[]){
    Promise.all(promises)
      .then(() => this.search(this.page, null, null, null));
  }

  getAllFieldStatusByFieldPromise() : Promise<void> {
    return new Promise((resolve, reject) => {
      this.fieldService.GetAllFieldStatus(new GetAllFieldStatusQuery(null)).subscribe(
        res => {
          this.fieldStatus = res;
          resolve();
        },
        err => {
          this.fieldStatus = [];
          const error = this.bService.handleErrorMessage(err);
          this.bService.toastr.error(error.message, error.title);
          reject();
        }
      );
    });
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

  initFieldTable() {
    this.columns = [
      {title: 'Descripcion', dataProperty: 'description'},
      {title: 'Tipo', dataProperty: 'type'},
      {title: 'Estado', dataProperty: 'status'},
    ];

    this.actions = [
      {name: 'Edit', click: (item) => this.editField(item), icon: FontAwesome.EDIT},
      {name: 'Delete', click: (item) => this.deleteField(item), icon: FontAwesome.DELETE},
    ];
  }

  editField(item: any) {
    this.bService.router.navigate([`/admin/fields/edit/${item.id}`]);
  }

  deleteField(item: any) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = false;
    config.autoFocus = false;
    config.maxWidth = '70%';
    config.width = '450px';
    config.data = {
      title: 'Eliminar cancha',
      body: `¿Esta seguro que quiere eliminar la cancha ${item.description}?`
    }

    this.bService.matDialog.open(ConfirmDialogComponent, config).afterClosed().subscribe(
      res => {
        if (res.confirm){
          this.startLoading();
          this.fieldService.DeleteField(item.id).subscribe(
            resp => {
              this.bService.toastr.success('Cancha eliminada', 'Éxito!');
              this.search(this.page, null, null, null);
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

  searchInit(): void {
    this.startLoading();

    this.search(this.page, 
                this.searchForm.value.description ? this.searchForm.value.description : null,
                this.searchForm.value.idFieldType ? this.searchForm.value.idFieldType : null,
                this.searchForm.value.idFieldStatus ? this.searchForm.value.idFieldStatus : null);
  }

  searchByPage(page: number): void {
    this.startLoading();

    this.search(page, 
                this.searchForm.value.description ? this.searchForm.value.description : null,
                this.searchForm.value.idFieldType ? this.searchForm.value.idFieldType : null,
                this.searchForm.value.idFieldStatus ? this.searchForm.value.idFieldStatus : null);
  }

  search(page: number, description: string | null, idFieldType: string | null, idFieldStatus: string | null): void {
    this.fields = [];
    this.metadata = undefined;
    this.fieldSearchObservable(page, description, idFieldType, idFieldStatus).subscribe(
      res => {
        this.fields = res.data;
        this.metadata = res.metadata;
        if(this.fields.length === 0){
          this.bService.toastr.info('No hay canchas para mostrar');
        }
      },
      err => {
        let error = this.bService.handleErrorMessage(err);
        this.bService.toastr.error(error.message, error.title);
      }
    ).add(() => this.stopLoading());
  }

  fieldSearchObservable(page: number, description: string | null, idFieldType: string | null, idFieldStatus: string | null): Observable<PagedListResponse<FieldByFilter[]>> {
    let query: GetFieldByFilterQuery = new GetFieldByFilterQuery(idFieldType, idFieldStatus, description, page, this.size);

    return this.fieldService.GetFieldByFilter(query);
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

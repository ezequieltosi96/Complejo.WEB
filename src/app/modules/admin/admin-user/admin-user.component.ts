import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GetUserByFilterQuery } from 'src/app/gateway/querys/user/user-by-filter.query';
import { Metadata } from 'src/app/models/responses/metadata';
import { PagedListResponse } from 'src/app/models/responses/paged-list-response';
import { UserByFilter } from 'src/app/models/user/user-by-filter';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ActionTable } from 'src/app/shared/generic-table/models/action-table';
import { ColumnTable } from 'src/app/shared/generic-table/models/column-table';
import { FontAwesome } from 'src/app/shared/utils/enums.utils';

@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css']
})
export class AdminUserComponent implements OnInit {

  public users: UserByFilter[] = [];

  public metadata: Metadata | undefined;
  public columns: ColumnTable[] = [];
  public actions: ActionTable[] = [];

  public page: number = 1;
  public size: number = 15;

  public loading: boolean = true;

  public FontAwesome = FontAwesome;

  public searchForm: FormGroup = this.bService.formBuilder.group({
    searchCriteria: ['']
  });

  constructor(private readonly bService: BaseComponentService,
              private readonly userService: UserService) { }

  ngOnInit(): void {
    this.startLoading();

    this.initUserTable();

    this.search(this.page, null);
  }

  initUserTable() {
    this.columns = [
      {title: 'Correo', dataProperty: 'email'},
      {title: 'Nombre Completo', dataProperty: 'fullName'},
      {title: 'User Name', dataProperty: 'userName'},
      {title: 'Rol', dataProperty: 'roleName'},
    ];

    this.actions = [
      {name: 'Edit', click: (item) => this.editUser(item), icon: FontAwesome.EDIT},
      {name: 'Delete', click: (item) => this.deleteUser(item), icon: FontAwesome.DELETE},
    ];
  }

  editUser(item: any) {
    this.bService.router.navigate([`/admin/users/edit/${item.id}`]);
  }

  deleteUser(item: any) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = false;
    config.autoFocus = false;
    config.maxWidth = '70%';
    config.width = '450px';
    config.data = {
      title: 'Eliminar usuario',
      body: `¿Esta seguro que quiere eliminar el usuario ${item.userName}?`
    }

    this.bService.matDialog.open(ConfirmDialogComponent, config).afterClosed().subscribe(
      res => {
        if (res.confirm){
          this.startLoading();
          this.userService.DeleteUser(item.id).subscribe(
            resp => {
              this.bService.toastr.success('Usuario eliminado', 'Éxito!');
              this.search(this.page, null);
            },
            err => {
              this.bService.toastr.error(err.error, 'Error');
              this.stopLoading();
            }
          );
        }
      }
    );
  }

  searchInit(): void {
    this.startLoading();
    this.search(this.page, this.searchForm.value.searchCriteria ? this.searchForm.value.searchCriteria : null);
  }

  searchByPage(page: number): void {
    this.startLoading();
    this.search(page, null);
  }

  search(page: number, searchCriteria: string | null): void {
    this.users = [];
    this.metadata = undefined;
    this.userSearchObservable(page, searchCriteria).subscribe(
      res => {
        this.users = res.data;
        this.metadata = res.metadata;
      },
      err => {
        console.log(`Error buscando pagina ${page}....`, err);
      }
    ).add(() => this.stopLoading());
    
  }

  userSearchObservable(page: number, searchCriteria: string | null): Observable<PagedListResponse<UserByFilter[]>> {
    let query:GetUserByFilterQuery = new GetUserByFilterQuery(searchCriteria, page, this.size);

    return this.userService.GetUserByFilter(query);
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

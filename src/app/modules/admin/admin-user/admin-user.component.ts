import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ResetPasswordCommand } from 'src/app/gateway/commands/user/reset-password.command';
import { GetUserByFilterQuery } from 'src/app/gateway/querys/user/user-by-filter.query';
import { Metadata } from 'src/app/models/responses/metadata';
import { PagedListResponse } from 'src/app/models/responses/paged-list-response';
import { UserByFilter } from 'src/app/models/user/user-by-filter';
import { AuthService } from 'src/app/services/auth.service';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { ActionTable } from 'src/app/shared/generic-table/models/action-table';
import { ColumnTable } from 'src/app/shared/generic-table/models/column-table';
import { FontAwesome, Pagination } from 'src/app/shared/utils/enums.utils';

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

  public page: number = Pagination.PAGE;
  public size: number = Pagination.PAGE_SIZE;

  public loading: boolean = true;

  public FontAwesome = FontAwesome;

  public searchForm: FormGroup = this.bService.formBuilder.group({
    searchCriteria: ['']
  });

  constructor(private readonly bService: BaseComponentService,
              private readonly userService: UserService,
              private readonly authService: AuthService) { }

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
    ];

    this.actions = [
      {name: 'Reset password', click: (item) => this.resetPassword(item), icon: FontAwesome.UNDO},
      {name: 'Delete', click: (item) => this.deleteUser(item), icon: FontAwesome.DELETE},
    ];
  }

  resetPassword(item: any) {
    const config = new MatDialogConfig();
    config.disableClose = true;
    config.hasBackdrop = false;
    config.autoFocus = false;
    config.maxWidth = '70%';
    config.width = '450px';
    config.data = {
      title: 'Restablecer contraseña',
      body: `¿Esta seguro que quiere restablecer la contraseña del usuario ${item.userName}?`
    }

    this.bService.matDialog.open(ConfirmDialogComponent, config).afterClosed().subscribe(
      res => {
        if (res.confirm){
          this.startLoading();
          this.userService.ResetPassword(new ResetPasswordCommand(item.id)).subscribe(
            resp => {
              this.bService.toastr.success('Contraseña restablecida [nombre]@[apellido]', 'Éxito!');
            },
            err => {
              let error = this.bService.handleErrorMessage(err);
              this.bService.toastr.error(error.message, error.title);
            }
          ).add(this.stopLoading());
        }
      }
    );
  }

  deleteUser(item: any) {

    const userContext = this.authService.getUserContext();

    if(userContext?.idUser == item.id) {
      this.bService.toastr.error('No puede eliminar el usuario actual', 'Error');
      return;
    }

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
    this.search(this.page, this.searchForm.value.searchCriteria ? this.searchForm.value.searchCriteria : null);
  }

  searchByPage(page: number): void {
    this.startLoading();
    this.search(page, this.searchForm.value.searchCriteria);
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
        let error = this.bService.handleErrorMessage(err);
        this.bService.toastr.error(error.message, error.title);
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

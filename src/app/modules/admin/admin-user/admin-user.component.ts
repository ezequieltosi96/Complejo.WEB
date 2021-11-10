import { Component, OnInit } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Metadata } from 'src/app/models/responses/metadata';
import { PagedListResponse } from 'src/app/models/responses/paged-list-response';
import { User } from 'src/app/models/user/user';
import { BaseComponentService } from 'src/app/services/base/base-component.service';
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

  public users: User[] = [];

  public metadata!: Metadata;
  public columns: ColumnTable[] = [];
  public actions: ActionTable[] = [];

  public FontAwesome = FontAwesome;

  constructor(private readonly bService: BaseComponentService) { }

  ngOnInit(): void {
    this.bService.spinner.show();

    this.initUserTable();

    let promises: Promise<void>[] = [];

    promises.push();// agregamos las llamadas a servicios necesarias (getAllUsers y para los filtros....)

    this.resolvePromises(promises)
  }

  resolvePromises(promises: Promise<void>[]): void {
    Promise.all(promises)
    .finally(() => this.bService.spinner.hide());
  }

  initUserTable() {
    this.columns = [
      {title: 'User Name', dataProperty: 'username', transform: (user) => `${user.username} ./ hola`},
      {title: 'Correo', dataProperty: 'email'},
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
      body: `¿Esta seguro que quiere eliminar el usuario ${item.username}?`
    }

    this.bService.matDialog.open(ConfirmDialogComponent, config).afterClosed().subscribe(
      res => {
        if (res.confirm){
          console.log("Eliminando usuario");
        }
      }
    );
  }

  
  //TODO: me estaba guiando de affiliate.component
  search(page: number): void {
    this.users = [];
    this.bService.spinner.show();
    this.userSearchObservable(page).subscribe(
      res => {
        this.users = res.data;
        this.metadata = res.metadata;
      },
      err => {
        console.log(`Error buscando pagina ${page}....`);
      }
    );
    
  }

  userSearchObservable(page: number): Observable<PagedListResponse<User[]>> {

    return of(); // llamada al servicio getByFilter
  }

}

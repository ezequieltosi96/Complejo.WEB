import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material

// Modules
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { GenericTableComponent } from './generic-table/generic-table.component';
import { DynamicFormComponent } from './dynamic/dynamic-form/dynamic-form.component';
import { DynamicFormControlComponent } from './dynamic/dynamic-form-control/dynamic-form-control.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
      NavBarComponent,
      NoPageFoundComponent,
      GenericTableComponent,
      DynamicFormControlComponent,
      DynamicFormComponent,
      ConfirmDialogComponent
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    NavBarComponent,
    NoPageFoundComponent,
    GenericTableComponent,
    DynamicFormControlComponent,
    DynamicFormComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }

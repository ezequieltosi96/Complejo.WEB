import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  public title: string;
  public body: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    this.title = data.title;
    this.body = data.body;
  }

  ok(): void {
    this.dialogRef.close({ confirm: true });
  }

  close(): void {
    this.dialogRef.close({ confirm: false });
  }

}

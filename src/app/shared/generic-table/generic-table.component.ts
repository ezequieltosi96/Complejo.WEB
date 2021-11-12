import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Metadata } from 'src/app/models/responses/metadata';
import { ActionTable } from './models/action-table';
import { ColumnTable } from './models/column-table';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnInit {

  public pages: number[] = [];
  
  @Input()
  public data: any[] = [];
  @Input()
  metadata: Metadata | undefined;
  @Input()
  public columns: ColumnTable[] = [];
  @Input()
  public actions: ActionTable[] = [];


  @Output() 
  public uploaded = new EventEmitter<number>();

  ngOnInit(): void {
    if(this.metadata) {
      this.getPages();
    }
  }

  search(page: number): void {
    this.uploaded.emit(page);
  }

  getPages(): void {
    this.pages = [];

    for (let i = 1; i <= this.metadata!.totalPages; i++) {
      this.pages.push(i);
    }
  }

}

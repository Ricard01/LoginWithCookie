import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnDefinition } from '../../models/column.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent {

  @Input() dataSource: any[] = [];
  @Input() columns: ColumnDefinition[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() pageSize: number = 10;

  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<any>();

  get totalNeto(): number {
    return  this.dataSource.reduce((sum, data) => sum + data.neto, 0);
  }
  
  get totalIva(): number {
    return this.dataSource.reduce((sum, data) => sum + data.iva, 0);
  }
  
  get totalGeneral(): number {
    return this.dataSource.reduce((sum, data) => sum + data.total, 0);
  }

  formatCell(value: any, format: string): string {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  }

  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }

  onActionClick(action: ((row: any) => void) | undefined, row: any): void {
    if (action) {
      action(row);
    }
    this.actionClick.emit(row);
  }
  

  getDisplayedColumns(): string[] {
    return this.columns.map((column) => column.key);
  }
}



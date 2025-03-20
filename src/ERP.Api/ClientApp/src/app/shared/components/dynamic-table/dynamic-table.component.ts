import { Component, EventEmitter, input, Input, Output, ViewEncapsulation } from '@angular/core';
import { ColumnDefinition } from '../../models/column.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
  encapsulation: ViewEncapsulation.None


})
export class DynamicTableComponent {

  @Input() data: any[] = [];
  @Input() tableTitle: string = '';
  @Input() badgeClass: string = '';
  @Input() startSpanNum : number = 3; 
  @Input() columns: ColumnDefinition[] = [];
  @Input() totalColumns: string[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() pageSize: number = 10;

  @Output() filterEvent = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<any>();



  get displayedTotalColumns(): string[] {
    return ['startSpan',...this.totalColumns]
  }

  calcularTotal(columna: string): number {
    return this.data.reduce((sum, row) => sum + (row[columna] || 0), 0);
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

  onFilterEvent(value: any) {
    this.filterEvent.emit(value)
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



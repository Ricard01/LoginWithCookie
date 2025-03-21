import { Component, EventEmitter, input, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ColumnDefinition } from '../../models/column.model';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
  encapsulation: ViewEncapsulation.None


})
export class DynamicTableComponent implements OnInit, OnChanges {

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

  filteredData: any[] = [];
  filterText: string = '';

  ngOnInit() {
    this.filteredData = [...this.data]; // Inicializar la tabla con todos los datos
  }

  ngOnChanges() {
    this.filteredData = [...this.data]; // Mantener sincronizado con cambios en data
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterText = filterValue;
  
    this.filteredData = this.data.filter(row =>
      this.filtrarPorColumnas(row, filterValue)
    );
  }
  
  private filtrarPorColumnas(row: any, filterValue: string): boolean {
    return (
      row.folio?.toString().toLowerCase().includes(filterValue) ||
      row.fecha?.toString().toLowerCase().includes(filterValue) ||
      row.cliente?.toLowerCase().includes(filterValue) ||
      row.descripcion?.toLowerCase().includes(filterValue)
    );
  }
  



  get displayedTotalColumns(): string[] {
    return ['filter','startSpan',...this.totalColumns]
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



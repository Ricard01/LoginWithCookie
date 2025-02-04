import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IPeriodo } from '../models/periodo.model';


@Component({
  selector: 'app-periodo-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  template: `
    <mat-form-field>
      <mat-label>Seleccionar Periodo</mat-label>
      <mat-select [formControl]="periodoControl" (selectionChange)="onSelectionChange($event)">
        @for (periodo of periodos; track periodo) {
          <mat-option [value]="periodo.value">{{ periodo.viewValue }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
})
export class PeriodoSelectComponent {
  @Input() periodos: IPeriodo[] = []; // Recibe los periodos desde el componente padre
  @Input() defaultValue: Date | null = null; // Recibe el valor por defecto
  @Output() periodoChange = new EventEmitter<Date>(); // Emite el valor seleccionado

  periodoControl = new FormControl(); // Control para el select

  ngOnChanges(): void {
    if (this.defaultValue) {
      this.periodoControl.setValue(this.defaultValue); // Establece el valor por defecto
    }
  }

  onSelectionChange(event: any): void {
    this.periodoChange.emit(event.value); // Emite el valor seleccionado
  }
}
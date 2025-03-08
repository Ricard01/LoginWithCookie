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
  @Input() periodos: IPeriodo[] = []; 
  @Input() defaultValue: Date | null = null; 
  @Output() periodoChange = new EventEmitter<Date>(); 

  periodoControl = new FormControl(); 

  ngOnChanges(): void {
    if (this.defaultValue && !this.periodoControl.value) {
      this.periodoControl.setValue(this.defaultValue); // 🔥 Solo si aún no tiene valor
    }
  }

  ngOnInit(): void {
    if (this.defaultValue && !this.periodoControl.value) {
      this.periodoControl.setValue(this.defaultValue);
    }

    // 🔥 Emitir el valor inicial si existe
    this.periodoControl.valueChanges.subscribe(value => {
      if (value) {
        this.periodoChange.emit(value);
      }
    });
  }

  onSelectionChange(event: any): void {
    this.periodoChange.emit(event.value); 
  }
}
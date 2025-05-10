import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { IPeriodo } from '../models/periodo.model';
import { distinctUntilChanged } from 'rxjs';



@Component({
  selector: 'app-periodo-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  template: `
    <mat-form-field>
      <mat-label>Seleccionar Periodo</mat-label>
      <mat-select [formControl]="periodoControl" >
        @for (periodo of periodos; track periodo) {
          <mat-option [value]="periodo.value">{{ periodo.viewValue }}</mat-option>
        }
      </mat-select>
    </mat-form-field>
  `,
  encapsulation: ViewEncapsulation.None
})

export class PeriodoSelectComponent implements OnInit, OnChanges{
  @Input() periodos: IPeriodo[] = []; 
  @Input() defaultValue: Date | null = null; 
  @Output() periodoChange = new EventEmitter<Date>(); 

  periodoControl = new FormControl(); 

  ngOnChanges(): void {
    if (this.defaultValue && !this.periodoControl.value) {
      this.periodoControl.setValue(this.defaultValue);
    }
  }

  ngOnInit(): void {
    if (this.defaultValue && !this.periodoControl.value) {
      this.periodoControl.setValue(this.defaultValue);
    }

    this.periodoControl.valueChanges
    .pipe(distinctUntilChanged())
    .subscribe(value => {
      if (value) {
        this.periodoChange.emit(value);
      }
    });
  }


}
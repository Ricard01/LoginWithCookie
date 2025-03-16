import { Component, EventEmitter,  Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';


@Component({
  selector: 'app-agente-select',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  template: `
 <mat-form-field>
      <mat-label>Seleccionar Agente</mat-label>
      <mat-select [formControl]="agenteControl">
        <mat-option [value]="1">Ricardo</mat-option>
        <mat-option [value]="2">Angie</mat-option>
        <mat-option [value]="3">Ambos</mat-option>
      </mat-select>
    </mat-form-field>
  `,
})
export class AgenteSelectComponent {

  @Output() agenteChange = new EventEmitter<number>();

  agenteControl = new FormControl(3); // Default 3=Ambos 

  constructor() {
 
    this.agenteChange.emit(this.agenteControl.value ?? 3);

    this.agenteControl.valueChanges.subscribe(value => {
      if (value !== null) { 
        this.agenteChange.emit(value);
      }
    });
  }
}
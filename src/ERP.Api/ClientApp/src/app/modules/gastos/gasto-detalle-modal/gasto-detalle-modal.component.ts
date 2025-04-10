import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-gasto-detalle-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './gasto-detalle-modal.component.html',
  styleUrl: './gasto-detalle-modal.component.scss'
})
export class GastoDetalleModalComponent implements OnInit {

    @Input() data: any;

  
    constructor( private dialogRef: MatDialogRef<any>,private snackBar: SnackbarService) {
  
    }
  ngOnInit(): void {

  }
  

  
    guardar() {
  
    }
  

}

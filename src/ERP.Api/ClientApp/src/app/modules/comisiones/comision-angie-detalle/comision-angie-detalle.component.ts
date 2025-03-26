import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { IMovimientoComisionAngie } from '../models/comision.model';
import { ComisionService } from '../services/comision.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-comision-angie-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './comision-angie-detalle.component.html',
  styleUrl: './comision-angie-detalle.component.scss'
})
export class ComisionAngieDetalleComponent {

  @Input() data: any;
  MovimientoComisionAngie: IMovimientoComisionAngie | undefined;
  nuevoNeto: number = 0;


  constructor( private dialogRef: MatDialogRef<any>, private comService: ComisionService, private snackBar: SnackbarService) {

  }


ngOnInit() {
  this.nuevoNeto = this.data.neto;
}

  guardar() {

    const dto: IMovimientoComisionAngie = {
      idMovimiento: this.data.idMovimiento,
      ivaRetenido: this.data.ivaRetenido,
      observaciones: this.data.observaciones,
      utilidadAngie: this.data.utilidadAngie,
      isrAngie: this.data.isrAngie,
      ivaAngie: this.data.ivaAngie
    };

    this.comService.updateComisionAngie(dto).subscribe(() => {
      this.dialogRef.close(true);
      this.snackBar.success('Info guardado con exito')
    });

  }

    calcMovtoComisiones(): void {
    

      const isr = this.nuevoNeto * 0.0125;
const iva = this.nuevoNeto * 0.16;
const utilidad = this.nuevoNeto - isr;

this.data.ivaAngie = iva;
this.data.isrAngie = isr;
this.data.utilidadAngie = utilidad;

    }
  
}

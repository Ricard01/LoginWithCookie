import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ComisionService } from '../../services/comision.service';
import { IMovimientoComisionRicardo } from '../../models/comision.model';

@Component({
  selector: 'app-comisiones-ricardo-detalle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule, MatIcon],
  templateUrl: './comisiones-ricardo-detalle.component.html'
})
export class ComisionesRicardoDetalleComponent {

  @Input() data: any;
  nuevoNeto: number = 0;

  constructor(private dialogRef: MatDialogRef<any>, private comService: ComisionService, private snackBar: SnackbarService) {}

  ngOnInit() {
    this.nuevoNeto = this.data.neto;
  }

  guardar() {

    const dto: IMovimientoComisionRicardo = {
      idMovimiento: this.data.idMovimiento,
      ivaRetenido: this.data.ivaRetenido,
      observaciones: this.data.observaciones,
      utilidadRicardo: this.data.utilidadRicardo,
      isrRicardo: this.data.isrRicardo,
      ivaRicardo: this.data.ivaRicardo
    };

    this.comService.updateComisionRicardo(dto).subscribe(() => {
      this.dialogRef.close(true);
      this.snackBar.success('Info guardado con exito')
    });

  }

  calcMovtoComisiones(): void {
    const isr = this.nuevoNeto * 0.0125;
    const iva = this.nuevoNeto * 0.16;
    const utilidad = this.nuevoNeto - isr;

    this.data.ivaRicardo = iva;
    this.data.isrRicardo = isr;
    this.data.utilidadRicardo = utilidad;
  }

}

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TipoContenidoOrigen } from '../../models/tipo.contenido.model';
import { ComisionAngieDetalleComponent } from "../../../modules/comisiones/comision-angie-detalle/comision-angie-detalle.component";
import { GastoDetalleModalComponent } from "../../../modules/gastos/gasto-detalle-modal/gasto-detalle-modal.component";

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, ComisionAngieDetalleComponent, GastoDetalleModalComponent],
  templateUrl: './dynamic-modal.component.html',
  styleUrl: './dynamic-modal.component.scss'
})
export class DynamicModalComponent {

  origen: TipoContenidoOrigen;
  TipoContenidoOrigen = TipoContenidoOrigen;

  constructor(
      public dialogRef: MatDialogRef<DynamicModalComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.origen = data.origenContenido as TipoContenidoOrigen;
     }

}

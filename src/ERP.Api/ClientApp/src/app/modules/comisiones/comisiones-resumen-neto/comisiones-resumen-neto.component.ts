import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IResumenComisionVm } from '../models/comision.model';
import { ComisionService } from '../services/comision.service';
import { GastoService } from '../../gastos/services/gasto.service';

@Component({
  selector: 'app-comisiones-resumen-neto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comisiones-resumen-neto.component.html',
  styleUrl: './comisiones-resumen-neto.component.scss'
})
export class ComisionesResumenNetoComponent {
  utilidadPersonal: number = 0;
  utilidadCompartida: number = 0;
  utilidadCompartidaDivida: number = 0;
  gastosOficina: number = 0;

  @Input() comision!: IResumenComisionVm;
  @Input() periodo!: Date;

  constructor(private gastosService: GastoService) { }

  ngOnChanges() {

    if(this.periodo && this.comision) {

      this.gastosService.getGastosOficina(this.periodo).subscribe({
        next: (gastoOficina) => {
          this.gastosOficina = gastoOficina;
          this.utilidadPersonal =   (this.comision.personal.utilidad + this.comision.personal.ivaAfavor) - this.comision.personal.isr;
          this.utilidadCompartida =   this.comision.compartida.utilidad - (this.comision.compartida.isrMensual + this.gastosOficina);
          this.utilidadCompartidaDivida = this.utilidadCompartida / 2;
        },
        error: (err) => {
          console.error('Error al obtener gastos de oficina:', err);
        }
      });

    }






  }


}

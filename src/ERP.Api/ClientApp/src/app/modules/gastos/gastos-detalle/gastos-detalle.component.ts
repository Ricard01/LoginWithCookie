import { Component, OnInit } from '@angular/core';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { IGasto } from '../models/gasto.model';
import { BehaviorSubject, switchMap } from 'rxjs';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { GastoService } from '../services/gasto.service';
import { ColumnDefinition } from 'src/app/shared/models/column.model';
import { DynamicTableComponent } from 'src/app/shared/components/dynamic-table/dynamic-table.component';
import { AgenteSelectComponent } from 'src/app/shared/components/agente-select.componet';

@Component({
  selector: 'app-gastos-detalle',
  standalone: true,
  imports: [DynamicTableComponent, PeriodoSelectComponent, AgenteSelectComponent],
  templateUrl: './gastos-detalle.component.html',
  styleUrl: './gastos-detalle.component.scss'
})
export class GastosDetalleComponent  implements OnInit{
  periodos = this.periodoService.getPeriodos();
  defaultPeriodo: Date | null = null;

  countGastos = 0;
  gastos: IGasto[] = [];

  columns: ColumnDefinition[] = [
    { key: 'folio', header: 'Folio' },
    { key: 'fecha', header: 'Fecha', format: 'date' },
    { key: 'proveedor', header: 'Proveedor' },
    { key: 'neto', header: 'Neto', format: 'currency' },
    { key: 'iva', header: 'Iva', format: 'currency' },
    { key: 'total', header: 'Total', format: 'currency' },
  ];

  totalColumns = ['total_neto', 'total_iva', 'total_total']
  
  // // Columnas visibles en la tabla
  // columns: ColumnDefinition[] = [];

  selectedAgente = new BehaviorSubject<number>(3);
  selectedPeriodo$!: BehaviorSubject<Date>;

  constructor( private periodoService: PeriodoService, private gastoService: GastoService) {  }

  ngOnInit() {

    this.defaultPeriodo = this.periodoService.getCurrentMonth();
    this.selectedPeriodo$ = new BehaviorSubject<Date>(this.defaultPeriodo);

    this.selectedPeriodo$
    .pipe(
      switchMap(periodo =>
        this.selectedAgente.pipe(
          switchMap(selectedAgenteId =>  this.gastoService.getGastosAgente(selectedAgenteId, periodo))
        )
      )
    ).subscribe(gastos => {
      this.gastos = gastos;

      console.log('Gastos:', gastos);
      this.countGastos = gastos.length
    });

  }

  // updateColumns(idAgente: number) {
  //   this.columns = this.columnsBase.filter(col => {
  //     if (idAgente === 3) {
  //       return col.key !== 'ivaRicardo' && col.key !== 'ivaAngie'; 
  //     } else if (idAgente === 2) {
  //       return col.key !== 'ivaRicardo'  && col.key !== 'iva';
  //     } else if (idAgente === 1) {
  //       return col.key !== 'ivaAngie' && col.key !== 'iva';
  //     }
  //     return true; // Mantener todas si no se cumple ninguna condición
  //   });
  // }

  onPeriodoChange(selectedValue: Date): void {
    this.selectedPeriodo$.next(selectedValue);
  }

  onAgenteChange(selectedIdAgente: number): void {
    this.selectedAgente.next(selectedIdAgente);
  }


  onRowClick(row: any): void {
    console.log('Fila clickeada:', row);
  }

}

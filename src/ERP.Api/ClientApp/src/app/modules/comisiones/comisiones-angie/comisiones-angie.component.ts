import { Component, OnInit } from '@angular/core';
import { ComisionService } from '../services/comision.service';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { IComisionAngie, IComisionesAmbos, IResumenComisionVm } from '../models/comision.model';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { ColumnDefinition } from 'src/app/shared/models/column.model';
import { DynamicTableComponent } from 'src/app/shared/components/dynamic-table/dynamic-table.component';
import { forkJoin } from 'rxjs';
import { TipoContenidoOrigen } from 'src/app/shared/models/tipo.contenido.model';
import { GastoService } from '../../gastos/services/gasto.service';
import { IGasto } from '../../gastos/models/gasto.model';
import { CommonModule } from '@angular/common';
import { ComisionesResumenNetoComponent } from "../comisiones-resumen-neto/comisiones-resumen-neto.component";


@Component({
  selector: 'app-comisiones-angie',
  standalone: true,
  imports: [CommonModule, PeriodoSelectComponent, DynamicTableComponent, ComisionesResumenNetoComponent],
  templateUrl: './comisiones-angie.component.html',
  styleUrl: './comisiones-angie.component.scss'
})
export class ComisionesAngieComponent implements OnInit {

  periodos = this.periodoService.getPeriodos();
  currentPeriodo: Date = this.periodoService.getCurrentMonth();
  readonly idAngelica = 2
  TipoContenidoOrigen = TipoContenidoOrigen; 
  resumenCom!: IResumenComisionVm;


  comisionesAngie: IComisionAngie[] = [];
  columnsAngieTable: ColumnDefinition[] = [
    { key: 'folio', header: 'Folio' },
    { key: 'fecha', header: 'Fecha', format: 'date' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'neto', header: 'Neto', format: 'currency' },
    { key: 'utilidadAngie', header: 'Utilidad', format: 'currency' },
    { key: 'descuento', header: 'Descuento', format: 'currency' },
    { key: 'ivaAngie', header: 'Iva', format: 'currency' },
    { key: 'isrAngie', header: 'Isr', format: 'currency' },
    { key: 'ivaRetenido', header: 'Iva Ret', format: 'currency' },

  ];
  totalsAngieTable = ['total_neto', 'total_utilidadAngie', 'total_descuento', 'total_ivaAngie', 'total_isrAngie', 'total_ivaRetenido', ]


  gastosAngie: IGasto[] = [];
  columnsGastosTable: ColumnDefinition[] = [
    { key: 'folio', header: 'Folio' },
    { key: 'fecha', header: 'Fecha', format: 'date' },
    { key: 'proveedor', header: 'Proveedor' },
    { key: 'neto', header: 'Neto', format: 'currency' },
    { key: 'iva', header: 'Iva', format: 'currency' },
    { key: 'total', header: 'Total', format: 'currency' },

  ];
  totalsGastosTable = ['total_neto', 'total_iva', 'total_total' ]

  comisionesAmbos: IComisionesAmbos[] = [];
  columnsAmbosTable: ColumnDefinition[] = [
    { key: 'folio', header: 'Folio' },
    { key: 'fecha', header: 'Fecha', format: 'date' },
    { key: 'cliente', header: 'Cliente' },
    { key: 'descripcion', header: 'Descripcion' },
    { key: 'comision', header: '% Com' },
    { key: 'utilidad', header: 'Ut. Ambos', format: 'currency' },
    { key: 'utilidadRicardo', header: 'Utilidad', format: 'currency' },
    { key: 'ivaRicardo', header: 'Iva ', format: 'currency' },
    { key: 'isrRicardo', header: 'Isr', format: 'currency' },
    { key: 'utilidadAngie', header: 'Utilidad ', format: 'currency' },
    { key: 'ivaAngie', header: 'Iva ', format: 'currency' },
    { key: 'isrAngie', header: 'Isr', format: 'currency' },
  ];
  totalsAmbosTable = ['total_utilidad', 'total_utilidadRicardo', 'total_ivaRicardo', 'total_isrRicardo', 'total_utilidadAngie', 'total_ivaAngie', 'total_isrAngie']

  constructor(private periodoService: PeriodoService, private comisionService: ComisionService, private gastoService: GastoService) { }

  ngOnInit() {
    this.cargarComisiones(this.currentPeriodo);
  }

  onPeriodoChange(periodo: Date): void {
    this.currentPeriodo = periodo;
    this.cargarComisiones(periodo);
  }


  private cargarComisiones(periodo: Date): void {
    forkJoin({
      resumenCom: this.comisionService.getResumenComisionesAngie(periodo),
      angie: this.comisionService.getComisionesAngie(periodo),
      ambos: this.comisionService.getComisionesAmbos(periodo),
      gastos: this.gastoService.getGastosAgente(2, periodo)
    }).subscribe({
      next: ({ resumenCom, angie, ambos, gastos }) => {


        this.resumenCom = resumenCom;
        this.comisionesAngie = angie;
        this.comisionesAmbos = ambos;
        this.gastosAngie = gastos;

      
      },
      error: (err) => {
        console.error('Error al cargar las comisiones:', err);
        // Aquí podrías mostrar un snackbar si lo usas
      },
    });
  }

}

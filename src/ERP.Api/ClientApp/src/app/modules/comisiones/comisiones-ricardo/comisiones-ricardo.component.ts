import { Component, OnInit } from '@angular/core';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { IComisionRicardo, IComisionesAmbos, IResumenComisionVm } from '../models/comision.model';
import { ComisionService } from '../services/comision.service';
import { TipoContenidoOrigen } from 'src/app/shared/models/tipo.contenido.model';
import { forkJoin } from 'rxjs';
import { ColumnDefinition } from 'src/app/shared/models/column.model';
import { IGasto } from '../../gastos/models/gasto.model';
import { GastoService } from '../../gastos/services/gasto.service';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from 'src/app/shared/components/dynamic-table/dynamic-table.component';
import { ComisionesResumenNetoComponent } from '../comisiones-resumen-neto/comisiones-resumen-neto.component';

@Component({
  selector: 'app-comisiones-ricardo',
  standalone: true,
  imports: [CommonModule, PeriodoSelectComponent, DynamicTableComponent, ComisionesResumenNetoComponent],
  templateUrl: './comisiones-ricardo.component.html',
  styleUrl: './comisiones-ricardo.component.scss'
})
export class ComisionesRicardoComponent implements OnInit {

  
    periodos = this.periodoService.getPeriodos();
    currentPeriodo: Date = this.periodoService.getCurrentMonth();
    readonly idRicardo = 1
    TipoContenidoOrigen = TipoContenidoOrigen; 
    resumenCom!: IResumenComisionVm;
  
  
    comisiones: IComisionRicardo[] = [];
    columnsRicardoTable: ColumnDefinition[] = [
      { key: 'folio', header: 'Folio' },
      { key: 'fecha', header: 'Fecha', format: 'date' },
      { key: 'cliente', header: 'Cliente' },
      { key: 'neto', header: 'Neto', format: 'currency' },
      { key: 'utilidadRicardo', header: 'Utilidad', format: 'currency' },
      { key: 'descuento', header: 'Descuento', format: 'currency' },
      { key: 'ivaRicardo', header: 'Iva', format: 'currency' },
      { key: 'isrRicardo', header: 'Isr', format: 'currency' },
      { key: 'ivaRetenido', header: 'Iva Ret', format: 'currency' },
  
    ];
    totalsRicardoTable = ['total_neto', 'total_utilidadAngie', 'total_descuento', 'total_ivaRicardo', 'total_isrRicardo', 'total_ivaRetenido', ]
  
  
    gastos: IGasto[] = [];
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
        resumenCom: this.comisionService.getResumenComisionesRicardo(periodo),
        ricardo: this.comisionService.getComisionRicardo(periodo),
        ambos: this.comisionService.getComisionesAmbos(periodo),
        gastosAgente: this.gastoService.getGastosAgente(this.idRicardo, periodo)
      }).subscribe({
        next: ({ resumenCom, ricardo, ambos, gastosAgente }) => {
  
  console.log(' Comisiones:', ricardo);
          this.resumenCom = resumenCom;
          this.comisiones = ricardo;
          this.comisionesAmbos = ambos;
          this.gastos = gastosAgente;
  
        
        },
        error: (err) => {
          console.error('Error al cargar las comisiones:', err);
          // Aquí podrías mostrar un snackbar si lo usas
        },
      });
    }

}

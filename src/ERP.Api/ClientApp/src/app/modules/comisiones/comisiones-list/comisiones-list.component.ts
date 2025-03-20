import { Component, OnInit } from '@angular/core';
import { ComisionService } from '../services/comision.service';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { IComisionAngie, IComisiones } from '../models/comision.model';
import { MatTableDataSource } from '@angular/material/table';
import { DynamicTableComponent } from "../../../shared/components/dynamic-table/dynamic-table.component";
import { ColumnDefinition } from 'src/app/shared/models/column.model';

@Component({
  selector: 'app-comisiones-list',
  standalone: true,
  imports: [PeriodoSelectComponent, SHARED_IMPORTS, DynamicTableComponent],
  templateUrl: './comisiones-list.component.html',
  styleUrl: './comisiones-list.component.scss'
})
export class ComisionesListComponent implements OnInit {

  periodos = this.periodoService.getPeriodos();
  defaultPeriodo: Date | null = null;

  displayedColumns = ['folio', 'fecha', 'cliente', 'descripcion', 'comision', 'utilidad', 'utilidadR', 'ivaR', 'isrR', 'utilidadA', 'ivaA', 'isrA'];


  columnsAngie: ColumnDefinition[] = [
    { key: 'folio', header: 'Folio' },
    { key: 'fecha', header: 'Fecha', format: 'date' },
    { key: 'cliente', header: 'Proveedor' },
    { key: 'neto', header: 'Neto', format: 'currency' },
    { key: 'descuento', header: 'Descuento', format: 'currency' },
    { key: 'ivaAngie', header: 'Iva', format: 'currency' },
    { key: 'isrAngie', header: 'Isr', format: 'currency' },
    { key: 'ivaRetenido', header: 'Iva Ret', format: 'currency' },
    { key: 'utilidadAngie', header: 'Utilidad', format: 'currency' },
  ];
  totalColumns = ['total_neto', 'total_descuento', 'total_ivaAngie', 'total_isrAngie', 'total_ivaRetenido', 'total_utilidadAngie']

  columnsAmbos: ColumnDefinition[] = [
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

  totalColumnsAmbos = ['total_utilidad', 'total_utilidadRicardo', 'total_ivaRicardo', 'total_isrRicardo', 'total_utilidadAngie', 'total_ivaAngie','total_isrAngie']

  totalUtilidad: number = 0;
  totalUtilidadR: number = 0;
  totalIvaR: number = 0;
  totalIsrR: number = 0;
  totalUtilidadA: number = 0;
  totalIvaA: number = 0;
  totalIsrA: number = 0;

  comisiones: IComisiones[] = [];
  comisionesAngie: IComisionAngie[] = [];
  comisionesAmbos: IComisiones[] = [];
  dataSource = new MatTableDataSource<IComisiones>([]);
  dataSourcePersonal = new MatTableDataSource<IComisionAngie>([]);

  constructor(private comisionService: ComisionService, private periodoService: PeriodoService) { }

  ngOnInit() {
    this.defaultPeriodo = this.periodoService.getCurrentMonth();
  }

  onPeriodoChange(selectedValue: Date): void {

    this.comisionService.getComisionesAngie(selectedValue).subscribe((data) => {
      this.comisionesAngie = data
    });

    this.comisionService.getComisionesAmbos(selectedValue).subscribe((comisiones) => {
      console.log('detalle', comisiones);
        this.comisionesAmbos = comisiones;

      this.dataSource.data = comisiones;
      this.totalUtilidad = comisiones.reduce((sum, item) => sum + item.utilidad, 0);
      this.totalUtilidadR = comisiones.reduce((sum, item) => sum + item.utilidadRicardo, 0);
      this.totalIvaR = comisiones.reduce((sum, item) => sum + item.ivaRicardo, 0);
      this.totalIsrR = comisiones.reduce((sum, item) => sum + item.isrRicardo, 0);
      this.totalUtilidadA = comisiones.reduce((sum, item) => sum + item.utilidadAngie, 0);
      this.totalIvaA = comisiones.reduce((sum, item) => sum + item.ivaAngie, 0);
      this.totalIsrA = comisiones.reduce((sum, item) => sum + item.isrAngie, 0);
    });

  }

  applyFilter(event: Event) {

    console.log(event, 'event')
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePersonal.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePersonal.paginator) {
      this.dataSourcePersonal.paginator.firstPage();
    }
  }



}

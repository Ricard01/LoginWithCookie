import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { IComisionRicardo, IComisionAngie } from '../models/comision.model';
import { ComisionService } from '../services/comision.service';

@Component({
  selector: 'app-comisiones-ricardo',
  standalone: true,
  imports: [[PeriodoSelectComponent, SHARED_IMPORTS]],
  templateUrl: './comisiones-ricardo.component.html',
  styleUrl: './comisiones-ricardo.component.scss'
})
export class ComisionesRicardoComponent {
  
  periodos = this.periodoService.getPeriodos();
  defaultPeriodo: Date | null = null;

  columnsToDisplayAngie = ['folio', 'fecha', 'cliente', 'descripcion', 'utilidad', 'iva', 'isr'];

  columns = [
    {
      columnDef: 'folio',
      header: 'Folio',
      cell: (element: IComisionRicardo) => `${element.folio}`,
    },
    {
      columnDef: 'fecha',
      header: 'Fecha',
      cell: (element: IComisionRicardo) => `${element.fecha}`,
      isDate: true,
    width: '120px',
    },
    {
      columnDef: 'cliente',
      header: 'Cliente',
      cell: (element: IComisionRicardo) => `${element.cliente}`,
    },
    {
      columnDef: 'descripcion',
      header: 'Descripcion',
      cell: (element: IComisionRicardo) => `${element.descripcion}`,
    },
    {
      columnDef: 'utilidadRicardo',
      header: 'utilidad',
      cell: (element: IComisionRicardo) => `${element.utilidadRicardo}`,
      isCurrency: true,
      width: '120px',
    },
    {
      columnDef: 'ivaRicardo',
      header: 'iva',
      cell: (element: IComisionRicardo) => `${element.ivaRicardo}`,
      isCurrency: true,
      width: '120px',
    },
    {
      columnDef: 'isrRicardo',
      header: 'isrRicardo',
      cell: (element: IComisionRicardo) => `${element.isrRicardo}`,
      isCurrency: true,
      width: '120px',
    },
  ];

  totalUtilidad: number = 0;
  totalIva: number = 0;
  totalIsr: number = 0;
  
  displayedColumns = this.columns.map(c => c.columnDef);

  comisionesAngie: IComisionAngie[] = [];
  comisionesRicardo: IComisionRicardo[] = [];
 dataSourceRicardo = new MatTableDataSource<IComisionRicardo>([]);

  constructor(private comisionService: ComisionService, private periodoService: PeriodoService) { }

  onPeriodoChange(selectedValue: Date): void {

    this.comisionService.getComisionRicardo(selectedValue).subscribe((comisiones) => {
    
      this.dataSourceRicardo.data = comisiones; 
      this.totalUtilidad = comisiones.reduce((sum, item) => sum + item.utilidadRicardo, 0);
      this.totalIva = comisiones.reduce((sum, item) => sum + item.ivaRicardo, 0);
      this.totalIsr = comisiones.reduce((sum, item) => sum + item.isrRicardo, 0);
    });

  }

  // this.getComisionesA(selectedValue);    this.ref.detectChanges();

 

  getComisionesA(periodo: Date) {
    this.comisionService.getComisionesAngie(periodo).subscribe((comisiones) => {
      this.comisionesAngie = comisiones
    });
  }

}

import { Component } from '@angular/core';
import { ComisionService } from '../services/comision.service';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { IComisionAngie, IComisionRicardo } from '../models/comision.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-comisiones-list',
  standalone: true,
  imports: [PeriodoSelectComponent, SHARED_IMPORTS],
  templateUrl: './comisiones-list.component.html',
  styleUrl: './comisiones-list.component.scss'
})
export class ComisionesListComponent {

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

  displayedColumns = this.columns.map(c => c.columnDef);

  comisionesAngie: IComisionAngie[] = [];
  comisionesRicardo: IComisionRicardo[] = [];
 dataSourceRicardo = new MatTableDataSource<IComisionRicardo>([]);

  constructor(private comisionService: ComisionService, private periodoService: PeriodoService) { }

  onPeriodoChange(selectedValue: Date): void {

    this.comisionService.getComisionRicardo(selectedValue).subscribe((comisiones) => {
    
      this.dataSourceRicardo.data = comisiones; 
    });

  }

  // this.getComisionesA(selectedValue);    this.ref.detectChanges();

 

  getComisionesA(periodo: Date) {
    this.comisionService.getComisionesAngie(periodo).subscribe((comisiones) => {
      this.comisionesAngie = comisiones
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ComisionService } from '../services/comision.service';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { IComisiones } from '../models/comision.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-comisiones-list',
  standalone: true,
  imports: [PeriodoSelectComponent, SHARED_IMPORTS],
  templateUrl: './comisiones-list.component.html',
  styleUrl: './comisiones-list.component.scss'
})
export class ComisionesListComponent implements OnInit {

  periodos = this.periodoService.getPeriodos();
  defaultPeriodo: Date | null = null;

  displayedColumns = ['folio', 'fecha', 'cliente', 'descripcion', 'utilidadR', 'ivaR', 'isrR', 'utilidadA', 'ivaA', 'isrA'];

  totalUtilidadR: number = 0;
  totalIvaR: number = 0;
  totalIsrR: number = 0;
  totalUtilidadA: number = 0;
  totalIvaA: number = 0;
  totalIsrA: number = 0;

  comisiones: IComisiones[] = [];
  dataSource = new MatTableDataSource<IComisiones>([]);

  constructor(private comisionService: ComisionService, private periodoService: PeriodoService) { }

  ngOnInit() {
    this.defaultPeriodo = this.periodoService.getCurrentMonth();
  }

  onPeriodoChange(selectedValue: Date): void {

    this.comisionService.getDetalleComisiones(selectedValue).subscribe((comisiones) => {
      console.log('detalle', comisiones);

      this.dataSource.data = comisiones;
      this.totalUtilidadR = comisiones.reduce((sum, item) => sum + item.utilidadRicardo, 0);
      this.totalIvaR = comisiones.reduce((sum, item) => sum + item.ivaRicardo, 0);
      this.totalIsrR = comisiones.reduce((sum, item) => sum + item.isrRicardo, 0);
      this.totalUtilidadA = comisiones.reduce((sum, item) => sum + item.utilidadAngie, 0);
      this.totalIvaA = comisiones.reduce((sum, item) => sum + item.ivaAngie, 0);
      this.totalIsrA = comisiones.reduce((sum, item) => sum + item.isrAngie, 0);
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

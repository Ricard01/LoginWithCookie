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

  displayedColumns = ['folio', 'fecha', 'cliente', 'descripcion', 'utilidad', 'iva', 'isr'];

  totalUtilidad: number = 0;
  totalIva: number = 0;
  totalIsr: number = 0;

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRicardo.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceRicardo.paginator) {
        this.dataSourceRicardo.paginator.firstPage();
    }
  }

}

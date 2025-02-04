import { Component } from '@angular/core';
import { ComisionService } from '../services/comision.service';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { IComisionAngie } from '../models/comision.model';
import { MatTableDataSource } from '@angular/material/table';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';

@Component({
  selector: 'app-comisiones-angie',
  standalone: true,
  imports: [PeriodoSelectComponent, SHARED_IMPORTS],
  templateUrl: './comisiones-angie.component.html',
  styleUrl: './comisiones-angie.component.scss'
})
export class ComisionesAngieComponent {
  periodos = this.periodoService.getPeriodos();
    defaultPeriodo: Date | null = null;
  
    displayedColumns = ['folio', 'fecha', 'cliente', 'descripcion', 'utilidad', 'iva', 'isr'];
  
  
    totalUtilidad: number = 0;
    totalIva: number = 0;
    totalIsr: number = 0;
  
    comisionesAngie: IComisionAngie[] = [];

   dataSourceAngie = new MatTableDataSource<IComisionAngie>([]);
  
    constructor(private comisionService: ComisionService, private periodoService: PeriodoService) { }
  
    onPeriodoChange(selectedValue: Date): void {
  
      this.comisionService.getComisionesAngie(selectedValue).subscribe((comisiones) => {
      
        this.dataSourceAngie.data = comisiones; 
        this.totalUtilidad = comisiones.reduce((sum, item) => sum + item.utilidadAngie, 0);
        this.totalIva = comisiones.reduce((sum, item) => sum + item.ivaAngie, 0);
        this.totalIsr = comisiones.reduce((sum, item) => sum + item.isrAngie, 0);
      });
  
    }
  
    // this.getComisionesA(selectedValue);    this.ref.detectChanges();
  
   
  
    getComisionesA(periodo: Date) {
      this.comisionService.getComisionesAngie(periodo).subscribe((comisiones) => {
        this.comisionesAngie = comisiones
      });
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceAngie.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSourceAngie.paginator) {
          this.dataSourceAngie.paginator.firstPage();
      }
    }
  

}

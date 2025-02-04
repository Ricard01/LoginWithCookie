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


}

import { Component } from '@angular/core';
import { ComisionService } from '../services/comision.service';

@Component({
  selector: 'app-comisiones-list',
  standalone: true,
  imports: [],
  templateUrl: './comisiones-list.component.html',
  styleUrl: './comisiones-list.component.scss'
})
export class ComisionesListComponent {


  constructor(private comisionService: ComisionService) { this.getComisionesA(); this.getComisionesR(); }

    
  getComisionesR() {
    this.comisionService.getComisionRicardo(new Date()).subscribe((comisiones) => {
      console.log('comisiones R', comisiones);
    });
  } 


  getComisionesA() {  
    this.comisionService.getComisionesAngie(new Date()).subscribe((comisiones) => {
      console.log('comisiones A', comisiones);
    });
  }

}

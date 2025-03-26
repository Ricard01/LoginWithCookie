import { Injectable } from '@angular/core';
import { IPeriodo, periodos } from '../models/periodo.model';


@Injectable({
  providedIn: 'root',
})

export class PeriodoService {
 
  getCurrentMonth(): Date {

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); //  Evita problemas con la hora
  
      //  Buscar el período correspondiente al mes actual
      const periodo = periodos.find(p => 
        p.value.getMonth() === currentDate.getMonth() -2 && 
        p.value.getFullYear() === currentDate.getFullYear()
      );
  
      return periodo ? periodo.value : periodos[0].value; // 🔥 Si no encuentra, usa el primer período
    
  }

  getPeriodos(): IPeriodo[] {
    return periodos;
  }
}
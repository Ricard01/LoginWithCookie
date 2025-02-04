import { Injectable } from '@angular/core';
import { IPeriodo, periodos } from '../models/periodo.model';


@Injectable({
  providedIn: 'root',
})

export class PeriodoService {
 
  getCurrentMonth(): Date | null {
  
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth(); // Base 0 (0 = enero, 1 = febrero, etc.)
    const currentYear = currentDate.getFullYear();
  

  
    // Filtra periodos con valores válidos
    const periodosValidos = periodos.filter((p) => p.value instanceof Date && !isNaN(p.value.getTime()));
  
    const periodo = periodosValidos.find((p) => {
      console.log('Periodo válido:', p.value.getMonth() + 1, p.value.getFullYear());
      return (
        p.value.getMonth() === currentMonth &&
        p.value.getFullYear() === currentYear
      );
    });
  
    return periodo ? periodo.value : null;
    
  }

  getPeriodos(): IPeriodo[] {
    return periodos;
  }
}
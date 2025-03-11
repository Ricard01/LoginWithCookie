import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { IGastosVm } from '../models/gasto.model';


@Injectable({
  providedIn: 'root'
})


export class GastoService {

  private gastosUrl = 'api/gastos';

  constructor(private http: HttpClient) { }

  sincronizarGastos(periodo: Date) {
      // const periodoRequest: IPeriodoRequest = { request: periodo };
      return this.http.post(`${this.gastosUrl}/sincronizar`, {periodo});  
    }

  getGastos(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();

    return this.http.get<IGastosVm>(`${this.gastosUrl}?periodo=${formattedPeriodo}`).pipe(
      
       map(resp => resp.gastos));
  }

}

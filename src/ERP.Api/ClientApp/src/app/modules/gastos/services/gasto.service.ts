import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGasto,  IMovimientos } from '../models/gasto.model';


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

    return this.http.get<IGasto[]>(`${this.gastosUrl}?periodo=${formattedPeriodo}`);
  }
  getGastosAgente(idAgente: number, periodo: Date,) {

    console.log('idAgente', idAgente, '<br> periodo', periodo);
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IGasto[]>(`${this.gastosUrl}/agente/${idAgente}?periodo=${formattedPeriodo}`);
    }



  updateMovtoGasto(movimiento: IMovimientos) {
    return this.http.patch(`${this.gastosUrl}/${movimiento.idMovimiento}`, movimiento);
  }

}

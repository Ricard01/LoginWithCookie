import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGasto } from '../models/gasto.model';
import { IMovimientos } from 'src/app/shared/models/movimientos.model';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GastoService {

  private gastosUrl = 'api/gastos';

  constructor(private http: HttpClient) { }

  sincronizarGastos(periodo: Date) {
    // const periodoRequest: IPeriodoRequest = { request: periodo };
    return this.http.post(`${this.gastosUrl}/sincronizar`, { periodo });
  }

  getGastos(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IGasto[]>(`${this.gastosUrl}?periodo=${formattedPeriodo}`);
  }

  getGastosOficina(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<number>(`${this.gastosUrl}/oficina/?periodo=${formattedPeriodo}`);
  }

  getGastosAgente(idAgente: number, periodo: Date,) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IGasto[]>(`${this.gastosUrl}/agente/${idAgente}?periodo=${formattedPeriodo}`).pipe(shareReplay(1));
  }

  updateMovtoGasto(movimiento: IMovimientos) {
    return this.http.patch(`${this.gastosUrl}/${movimiento.idMovimiento}`, movimiento);
  }

}

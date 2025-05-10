import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IComisionAngie, IComisionesAmbos, IResumenComisionVm, IComisionRicardo, IMovimientoComisionAngie, IMovimientoComisionRicardo, IcomisionesPorPeriodo } from '../models/comision.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ComisionService {

  private comisionesUrl = 'api/comisiones';
  comisionR!: IComisionRicardo[];
  comisionA!: IComisionAngie[];
  comisiones!: IComisionesAmbos[];

  constructor(private http: HttpClient) {
  }

  getComisionesAmbos(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IComisionesAmbos[]>(`${this.comisionesUrl}/${formattedPeriodo}`);
  }

  getComisionRicardo(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IComisionRicardo[]>(`${this.comisionesUrl}/ricardo/${formattedPeriodo}`);
  }

  getComisionesAngie(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IComisionAngie[]>(`${this.comisionesUrl}/angie/${formattedPeriodo}`);
  }

  getResumenComisionesAngie(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IResumenComisionVm>(`${this.comisionesUrl}/angie/summary/${formattedPeriodo}`);
  }

  getResumenComisionesRicardo(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IResumenComisionVm>(`${this.comisionesUrl}/ricardo/summary/${formattedPeriodo}`);
  }

  updateComisionAngie(movto: IMovimientoComisionAngie): Observable<any> {
    return this.http.patch(`${this.comisionesUrl}/angie/${movto.idMovimiento}`, movto);
  }

  updateComisionRicardo(movto: IMovimientoComisionRicardo): Observable<any> {
    return this.http.patch(`${this.comisionesUrl}/ricardo/${movto.idMovimiento}`, movto);
  }

  getTotalPeriodo(idAgente: number, periodo: Date): Observable<IcomisionesPorPeriodo> {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IcomisionesPorPeriodo>(`${this.comisionesUrl}/total/${idAgente}?periodo=${formattedPeriodo}`);
  }

  saveTotals(comision: IcomisionesPorPeriodo): Observable<IcomisionesPorPeriodo> {
    return this.http.post<IcomisionesPorPeriodo>(`${this.comisionesUrl}/total`, comision);
  }

}

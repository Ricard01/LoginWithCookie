import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap, } from "rxjs";
import { IFactura, IFacturaVm, IMovimientos } from '../models/factura.model';



@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private doctossUrl = 'api/doctos';
  facturas: IFactura[]|undefined;

  constructor(private http: HttpClient) {
  }

  get(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IFacturaVm>(`${this.doctossUrl}/${formattedPeriodo}`).pipe(
      tap(resp => {
   
        // console.log('serv',resp.facturas) 

      }),
       map(resp => resp.facturas));
  }

  getComisionesR() {
    
    return this.http.get(`${this.doctossUrl}`).pipe(
      tap(resp => {
   
        console.log('comisionesR',resp) 

      }),
       map(resp => resp));
  }

  updateMovimiento(movimiento: IMovimientos): Observable<any> {
    return this.http.patch(`${this.doctossUrl}/${movimiento.idMovimiento}`, movimiento);
  }
}

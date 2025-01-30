import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap, } from "rxjs";
import { IFactura, IFacturaVm } from '../models/factura.model';


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
   
        console.log('serv',resp.facturas) 

      }),
       map(resp => resp.facturas));
  }

  updateMovimiento(movimiento: any): Observable<any> {
    return this.http.patch(`${this.doctossUrl}/${movimiento.idMovimiento}`, movimiento);
  }
}

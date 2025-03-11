import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap, } from "rxjs";
import { IFactura, IFacturaVm, IMovimientos } from '../models/factura.model';



@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private facturasUrl = 'api/facturas';
  facturas: IFactura[]|undefined;

  constructor(private http: HttpClient) {
  }


  sincronizarFacturas(periodo: Date) {
    // const periodoRequest: IPeriodoRequest = { request: periodo };
    return this.http.post(`${this.facturasUrl}/sincronizar`, {periodo});  
  }

  getFacturasPagadas(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IFacturaVm>(`${this.facturasUrl}/pagadas?periodo=${formattedPeriodo}`).pipe(
      tap(resp => {
   
        console.log('Pagadas',resp.facturas) 

      }),
       map(resp => resp.facturas));
  }

  getFacturasPendientes(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IFacturaVm>(`${this.facturasUrl}/pendientes?periodo=${formattedPeriodo}`).pipe(
      tap(resp => {
   
        console.log('Pendientes',resp.facturas) 

      }),
       map(resp => resp.facturas));
  }


  getComisionesR() {
    
    return this.http.get(`${this.facturasUrl}`).pipe(
      tap(resp => {
   
        // console.log('comisionesR',resp) 

      }),
       map(resp => resp));
  }

  
  getComisionesA() {
    
    return this.http.get(`${this.facturasUrl}/angie`).pipe(
      tap(resp => {
   
        // console.log('comisionesA',resp) 

      }),
       map(resp => resp));
  }


  updateMovimiento(movimiento: IMovimientos): Observable<any> {
    return this.http.patch(`${this.facturasUrl}/${movimiento.idMovimiento}`, movimiento);
  }
}

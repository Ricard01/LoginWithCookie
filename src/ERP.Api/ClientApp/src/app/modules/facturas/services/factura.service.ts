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

  getAll(): Observable<IFactura[]> {
    return this.http.get<IFacturaVm>(this.doctossUrl).pipe(
      tap(resp => {
        this.facturas = resp.doctos;
        console.log('serv',this.facturas) 

      }),
       map(resp => resp.doctos));
  }
}

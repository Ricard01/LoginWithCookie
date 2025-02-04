import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IComisionAngie, IComisiones, IComisionRicardo } from '../models/comision.model';


@Injectable({
  providedIn: 'root'
})
export class ComisionService {

  private doctossUrl = 'api/doctos';
  comisionR!: IComisionRicardo[];
  comisionA!: IComisionAngie[];
  comisiones!: IComisiones[];

  constructor(private http: HttpClient) {
  }

  getDetalleComisiones(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IComisiones[]>(`${this.doctossUrl}/comisiones/${formattedPeriodo}`);
  }

  getComisionRicardo(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IComisionRicardo[]>(`${this.doctossUrl}/ricardo/${formattedPeriodo}`); 
  }

  
  getComisionesAngie(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IComisionAngie[]>(`${this.doctossUrl}/angie/${formattedPeriodo}`);
  }


}

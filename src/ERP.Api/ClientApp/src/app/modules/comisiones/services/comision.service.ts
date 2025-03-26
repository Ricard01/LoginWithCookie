import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IComisionAngie, IComisionesAmbos, IComisionRicardo, IMovimientoComisionAngie, IMovimientoComisionRicardo } from '../models/comision.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ComisionService {

  private comisionesUrl= 'api/comisiones';
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


   updateComisionAngie(movto: IMovimientoComisionAngie): Observable<any> {
      return this.http.patch(`${this.comisionesUrl}/angie/${movto.idMovimiento}`, movto);
    }

    
   updateComisionRicardo(movto: IMovimientoComisionRicardo): Observable<any> {
    return this.http.patch(`${this.comisionesUrl}/ricardo/${movto.idMovimiento}`, movto);
  }

}

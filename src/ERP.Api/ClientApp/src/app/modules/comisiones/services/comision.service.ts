import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { IComisionAngie, IComisionRicardo } from '../models/comision.model';
import { tap } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ComisionService {

  private doctossUrl = 'api/doctos';
  comisionR!: IComisionRicardo[];
  comisionA!: IComisionAngie[];

  constructor(private http: HttpClient) {
  }

  getComisionRicardo(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IComisionRicardo[]>(`${this.doctossUrl}/ricardo/${formattedPeriodo}`).pipe(
      tap(resp => { 
        console.log('comisiones R',resp)
      })
    );
  }


  
  getComisionesAngie(periodo: Date) {
    const formattedPeriodo = periodo.toISOString();
    return this.http.get<IComisionAngie[]>(`${this.doctossUrl}/angie/${formattedPeriodo}`).pipe(
      tap(resp => { 
        console.log('comisionesAngie',resp)
      })
    );
  }


}

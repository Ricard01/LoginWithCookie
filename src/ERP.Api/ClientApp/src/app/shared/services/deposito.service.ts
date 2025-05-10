import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IDeposito, IDepositosRequestDto } from '../models/depositos.model';
import { Observable, shareReplay } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class DepositoService {

    private depositosUrl = 'api/depositos';

    constructor(private http: HttpClient) { }

    get(idAgente: number, periodo: Date) {
        const formattedPeriodo = periodo.toISOString();
        return this.http.get<IDeposito[]>(`${this.depositosUrl}?idAgente=${idAgente}&periodo=${formattedPeriodo}`).pipe(shareReplay(1));
    }

    save(requestDto: IDepositosRequestDto): Observable<IDeposito[]> {
        return this.http.post<IDeposito[]>(this.depositosUrl, requestDto);
    }

    delete(id: number) {
        return this.http.delete<boolean>(`${this.depositosUrl}/${id}`);
    }

}
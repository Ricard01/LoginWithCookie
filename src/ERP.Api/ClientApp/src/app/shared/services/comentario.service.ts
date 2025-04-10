import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IComentario } from '../models/comentarios.model';

@Injectable({ providedIn: 'root' })

export class ComentarioService {

    private comentariosUrl = 'api/comentarios';

    constructor(private http: HttpClient) { }

    getByIdAgenteAndPeriodo(idAgente: number, periodo: Date) {
        const formattedPeriodo = periodo.toISOString();
        return this.http.get<IComentario>(`${this.comentariosUrl}/agente/${idAgente}`, { params: {periodo: formattedPeriodo}} );
    }

    save(comentarios: IComentario) {
        return this.http.post<IComentario>(this.comentariosUrl, comentarios);
    }

}
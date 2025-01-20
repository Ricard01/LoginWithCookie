import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";
import { IDoctoVm } from '../models/docto.model';


@Injectable({
  providedIn: 'root'
})
export class DoctosService {

  private doctossUrl = 'api/doctos';

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<IDoctoVm>(this.doctossUrl).pipe(map(data => data.doctos));
  }
}

import { ResolveFn } from '@angular/router';
import { IDocto } from '../models/docto.model';
import { DoctosService } from '../services/doctos.service';
import { inject } from '@angular/core';

export const doctosResolver: ResolveFn<IDocto[]> = (route, state) => {

  const doctoservice = inject(DoctosService);
 
  return doctoservice.getAll();

};

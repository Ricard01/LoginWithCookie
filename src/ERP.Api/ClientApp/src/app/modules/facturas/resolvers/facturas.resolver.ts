import { ResolveFn } from '@angular/router';
import { IFactura, IFacturaVm } from '../models/factura.model';
import { FacturaService } from '../services/factura.service';
import { inject } from '@angular/core';

export const facturasResolver: ResolveFn<IFactura[]> = (route, state) => {

  const facturaService = inject(FacturaService);
 
  return facturaService.get(new Date('01-01-2025'));

};

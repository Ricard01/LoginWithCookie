import { FormGroup } from '@angular/forms';

export interface IFacturaVm {
  facturas: IFactura[]
}

export interface IFactura {
  id: number;
  fecha: Date;
  serie: string;
  folio: number;
  agente?: string;
  cliente: string;
  neto?: number;
  descuento?: number;
  total?: number;
  pendiente?: number;
  utlidad?: number;
  movimientos: IMovimientos[]
  expanded?: boolean; // Propiedad opcional para manejar la expansión
}

export interface IMovimientos {
  id: number;
  idMovimiento: number;
  idAgente?: number;
  neto: number;
  descuento?: number;
  impuesto?: number;
  retencion?: number;
  codigoProducto: string;
  nombreProducto: string;
  descripcion?: string ;
  comision?: number;
  utilidad?: number;
  utilidadRicardo?: number;
  utilidadAngie?: number;
  ivaRicardo?: number;
  ivaAngie?: number;
  isrRicardo?: number;
  isrAngie?: number;
  observaciones?: string;
}
export interface IMovimientosConForm extends IMovimientos {
  form: FormGroup;
}
export interface IPeriodo {
  value?: Date;
  viewValue?: string;
}




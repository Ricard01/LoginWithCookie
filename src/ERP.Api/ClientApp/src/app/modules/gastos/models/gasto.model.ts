import { FormGroup } from '@angular/forms';

export interface IGastosVm {
  gastos: IGasto[]
}

export interface IGasto {
  id: number;
  concepto: string;
  fecha: Date;
  serie?: string;
  folio: number;
  cliente: string;
  neto: number;
  total: number;
  descuento: number;
  pendiente: number;
  cancelado: number;
  url?: string;
  agente?: string;
  utilidad: number;
  fechaPago?: string;
  folioPago?: string;
  fechaCreacionPago?: string;
  movimientos: IMovimientos[];
  expanded?: boolean; // Propiedad opcional para manejar la expansión
}

export interface IMovimientos {
  id: number;
  idMovimiento: number;
  idAgente?: number;
  neto: number;
  descuento?: number;
  iva?: number;
  isr?: number;
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





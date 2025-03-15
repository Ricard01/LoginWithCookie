
import { IMovimientos } from 'src/app/shared/models/movimientos.model';

export interface IFacturaVm {
  facturas: IFactura[]
}

export interface IFactura {
  id: number;
  concepto: string;
  fecha: Date;
  serie?: string;
  folio: number;
  cliente: string;
  neto: number;
  iva: number; 
  ivaRetenido: number;
  isr: number;
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






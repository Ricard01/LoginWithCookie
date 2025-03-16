
import { IMovimientos } from 'src/app/shared/models/movimientos.model';

export interface IGasto {
  id: number;
  concepto: string;
  fecha: Date;
  serie?: string;
  folio: number;
  cliente: string;
  neto: number;
  iva: number;
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
  afectaComisiones: number;
  movimientos: IMovimientos[];
  expanded?: boolean; // Propiedad opcional para manejar la expansión
}








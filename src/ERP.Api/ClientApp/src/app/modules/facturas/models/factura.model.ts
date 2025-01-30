export interface IFacturaVm {
  facturas: IFactura[]
}

export class IFactura {
  id!: number;
  fecha!: Date;
  serie?: string;
  folio!: number;
  agente?: string;
  cliente?: string;
  neto?: number;
  descuento?: number;
  total?: number;
  pendiente?: number;
  utlidad?: number;
  movimientos!: Movimientos[]
}

export class Movimientos {
  id!: number;
  idMovimiento!: number;
  idAgente!: number | null;
  neto!: number;
  descuento!: number;
  impuesto!: number;
  retencion!: number;
  codigoProducto!: string;
  nombreProducto!: string;
  descripcion?: string  | null;
  comision!: number;
  utilidad!: number;
  utilidadRicardo!: number;
  utilidadAngie!: number;
  ivaRicardo!: number;
  ivaAngie!: number;
  isrRicardo!: number;
  isrAngie!: number;
  observaciones?: string;
}

export interface IFacturaVm {
  doctos: IFactura[]
}

export class IFactura2 {
  ciddocumento!: number;
  cfecha!: Date;
  cfolio!: number;
  crazonsocial?: string;
  cneto?: number;
  admMovimientos!: admMovimientos2[]
}

export class admMovimientos2 {
  cneto?: string;
  cdescuento1?: string;
  cimpuesto1?: string;
  cretencion1?: string;
}

export class IPeriodo {
  value?: Date;
  viewValue?: string;
}




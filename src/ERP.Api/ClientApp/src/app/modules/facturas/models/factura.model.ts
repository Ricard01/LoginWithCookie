export interface IFacturaVm {
  doctos: IFactura[]
}

export class IFactura {
  ciddocumento!: number;
  cfecha!: Date;
  cfolio!: number;
  crazonsocial?: string;
  cneto?: number;
  admMovimientos!: admMovimientos[]
}

export class admMovimientos {
  cneto?: string;
  cdescuento1?: string;
  cimpuesto1?: string;
  cretencion1?: string;
}




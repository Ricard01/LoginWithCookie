export interface IResumenComisionVm {
personal: IResumenPersonal;
compartida: IResumenCompartida;
}

export interface IResumenComisionBase{
  neto: number;
  utilidad: number;
  descuento: number;
  iva: number;
  isr: number; 
  ivaRet: number; 
  isrMensual: number;
  ivaAfavor: number;
  totalImpuestos: number;
}

export interface IResumenPersonal extends IResumenComisionBase { }

export interface IResumenCompartida extends IResumenComisionBase {
gastos: number;
}


export interface IComisionBase {
  idComercial: number; 
  fecha: string;
  folio: number;
  cliente: string;
  idMovimiento: number;
  idAgente: number;
  nombreProducto: string;
  descripcion: string;
  neto: number;
  descuento: number;
  comision: number;
  ivaRetenido: number; 
  utilidad: number;
  observaciones: string | null; 
}

export interface IComisionRicardo extends IComisionBase {
  ivaRicardo: number;
  isrRicardo: number;
  utilidadRicardo: number;
}

export interface IComisionAngie extends IComisionBase {
    ivaAngie: number;
    isrAngie: number;
    utilidadAngie: number;
  }

  export interface IComisionesAmbos extends IComisionBase {
    utilidadRicardo: number;
    ivaRicardo: number;
    isrRicardo: number;
    utilidadAngie: number;
    ivaAngie: number;
    isrAngie: number;
  }
  

  export interface IMovimientoComisionBase {
    idMovimiento: number, 
    ivaRetenido: number, 
    observaciones: string, 
  }

  export interface IMovimientoComisionAngie  extends IMovimientoComisionBase{
    utilidadAngie: number,
    isrAngie: number, 
    ivaAngie: number
  }

  export interface IMovimientoComisionRicardo  extends IMovimientoComisionBase{
    utilidadRicardo: number,
    isrRicardo: number, 
    ivaRicardo: number
  }
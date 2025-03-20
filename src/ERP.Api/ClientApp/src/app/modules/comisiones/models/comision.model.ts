export interface IComisionRicardo {
  idComercial: number; 
  fecha: string;
  serie: string;
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
  ivaRicardo: number;
  isrRicardo: number;
  utilidadRicardo: number;
  observaciones: string | null; 
}

export interface IComisionAngie {
    idComercial: number; 
    fecha: string;
    serie: string;
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
    ivaAngie: number;
    isrAngie: number;
    utilidadAngie: number;
    observaciones: string | null;
  }

  export interface IComisiones {
    fecha: string;
    serie: string;
    folio: number;
    cliente: string;
    idMovimiento: number;
    idAgente: number;
    nombreProducto: string;
    descripcion: string;
    neto: number;
    descuento: number; 
    comision: number;
    utilidad: number;
    utilidadRicardo: number;
    ivaRicardo: number;
    isrRicardo: number;
    utilidadAngie: number;
    ivaAngie: number;
    isrAngie: number;
    observaciones: string | null;
  }
  
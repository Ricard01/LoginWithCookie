export interface IComisionRicardo {
  fecha: string;
  serie: string;
  folio: number;
  cliente: string;
  idMovimiento: number;
  idAgente: number;
  nombreProducto: string;
  descripcion: string;
  neto: number;
  comision: number;
  utilidad: number;
  utilidadRicardo: number;
  ivaRicardo: number;
  isrRicardo: number;
  observaciones: string | null; 
}

export interface IComisionAngie {
    fecha: string;
    serie: string;
    folio: number;
    cliente: string;
    idMovimiento: number;
    idAgente: number;
    nombreProducto: string;
    descripcion: string;
    neto: number;
    comision: number;
    utilidad: number;
    utilidadAngie: number;
    ivaAngie: number;
    isrAngie: number;
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
  
import { FormGroup } from '@angular/forms';

export interface IMovimientos {
    id: number;
    idComercial: number
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
    afectaComisiones: number;
  }
  export interface IMovimientosConForm extends IMovimientos {
    form: FormGroup;
  }
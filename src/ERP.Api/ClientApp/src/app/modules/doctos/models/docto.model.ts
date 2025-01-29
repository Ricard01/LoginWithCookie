import { MatTableDataSource } from '@angular/material/table';

export interface IDoctoVm {
  doctos: IDocto[]
}

export class IDocto {
  ciddocumento!: number;
  cfecha!: Date;
  cfolio!: number;
  crazonsocial?: string;
}

export interface IDoctoVm {
  doctos: IDocto[]
}

export class IFacturas {
  ciddocumento!: number;
  cfecha!: Date;
  cfolio!: number;
  crazonsocial?: string;
  cneto?: string;
  admMovimientos!: IMovimientos[] | MatTableDataSource<IMovimientos>;
}

export class IMovimientos {
//  cidmovimiento?: string;
 cneto?: string;
}
 // cdescuentomov?: string;
 // ctotal?: string;
  // cpendiente?: string;
  // cimpuesto1?: string;
  // cretencion1?: string;
  // admMovimientos!: IMovimientos[];


// cdescuento1?: string;
//  cimpuesto1?: string;
//  cretencion1?: string;
// productos: IProductos | undefined
export class IProductos {

  cidproducto?: string;
  ccodigoproducto?: string;
  cnombreproduto?: string;
}




export interface IDeposito {
    id?: number;
    importe: number;
    comentario: string;
}

export interface IDepositosRequestDto {
    idAgente: number;
    periodo: Date; // o string
    depositos: IDeposito[];
  }
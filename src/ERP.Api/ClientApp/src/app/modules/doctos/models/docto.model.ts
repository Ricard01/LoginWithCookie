export interface IDoctoVm {
  doctos: IDocto[]
}

export class IDocto {
  ciddocumento!: number;
  cfecha!: Date;
  cfolio!: number;
  crazonsocial?: string;
}


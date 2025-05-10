export interface IPeriodo {
  value: Date;
  viewValue: string;
}

export const periodos: IPeriodo[] = [
  { value: new Date(2025, 0, 1), viewValue: 'Enero' },
  { value: new Date(2025, 1, 1), viewValue: 'Febrero' },
  { value: new Date(2025, 2, 1), viewValue: 'Marzo' },
  { value: new Date(2025, 3, 1), viewValue: 'Abril' },
  { value: new Date(2025, 4, 1), viewValue: 'Mayo' },
  { value: new Date(2025, 5, 1), viewValue: 'Junio' },
];


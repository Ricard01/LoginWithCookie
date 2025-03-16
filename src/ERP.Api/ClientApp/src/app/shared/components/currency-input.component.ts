// import { Component, Input, forwardRef, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ControlValueAccessor, NG_VALUE_ACCESSOR, AbstractControl } from '@angular/forms';

// @Component({
//   standalone: true,
//   selector: 'app-currency-input',
//   imports: [FormsModule],
//   styles: [`  .short-input{
//     width:70px !important;
//  }`],
//   template: `
//     <input
//       class="short-input"
//       [(ngModel)]="displayValue"
//       (ngModelChange)="onInputChange($event)"
//       (focus)="onFocus()"
//       (blur)="onBlur()"
//       [disabled]="!control"
//     />
//   `,
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => CurrencyInputComponent),
//       multi: true,
//     },
//   ],
// })
// export class CurrencyInputComponent implements ControlValueAccessor, OnInit {
//   @Input() control: AbstractControl | null | undefined= null; // Acepta AbstractControl o null
//   displayValue: string = ''; // Valor mostrado en el input
//   private numericValue: number | null = null; // Valor numérico real

//   // Métodos requeridos por ControlValueAccessor
//   onChange: any = () => {};
//   onTouched: any = () => {};

//   ngOnInit(): void {
//     if (this.control) {
//       // Escuchar cambios en el control del formulario
//       this.control.valueChanges.subscribe((value) => {
//         this.numericValue = value;
//         this.formatDisplayValue(); // Actualizar el valor mostrado
//       });

//       // Inicializar el valor mostrado
//       this.numericValue = this.control.value;
//       this.formatDisplayValue();
//     }
//   }

//   writeValue(value: any): void {
//     this.numericValue = value;
//     this.formatDisplayValue();
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   // Formatea el valor como moneda MXN
//   private formatDisplayValue(): void {
//     if (this.numericValue !== null && !isNaN(this.numericValue)) {
//       this.displayValue = new Intl.NumberFormat('es-MX', {
//         style: 'currency',
//         currency: 'MXN',
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//       }).format(this.numericValue);
//     } else {
//       this.displayValue = '';
//     }
//   }

//   // Maneja cambios en el input
//   onInputChange(value: string): void {
//     if (!this.control) return; // Si el control es null, no hacer nada

//     // Elimina caracteres no numéricos y convierte a número
//     const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
//     this.numericValue = isNaN(numericValue) ? null : numericValue;

//     // Actualiza el control del formulario
//     this.control.setValue(this.numericValue, { emitEvent: false });
//     this.onChange(this.numericValue); // Notifica al formulario reactivo
//   }

//   // Cuando el input está enfocado
//   onFocus(): void {
//     if (!this.control) return; // Si el control es null, no hacer nada

//     // Muestra el valor sin formato durante la edición
//     this.displayValue = this.numericValue !== null && !isNaN(this.numericValue) ? this.numericValue.toString() : '';
//   }

//   // Cuando el input pierde el foco
//   onBlur(): void {
//     if (!this.control) return; // Si el control es null, no hacer nada

//     // Formatea el valor como moneda MXN después de la edición
//     this.formatDisplayValue();
//     this.onTouched();
//   }
// }
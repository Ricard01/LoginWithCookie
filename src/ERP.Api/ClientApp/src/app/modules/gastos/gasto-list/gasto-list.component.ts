import { Component } from '@angular/core';
import { GastoService } from '../services/gasto.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, forkJoin, share, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { IFactura } from '../../facturas/models/factura.model';
import { FacturaService } from '../../facturas/services/factura.service';
import { IGasto, IMovimientos } from '../models/gasto.model';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { CurrencyInputComponent } from 'src/app/shared/components/currency-input.component';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';

@Component({
  selector: 'app-gasto-list',
  standalone: true,
  imports: [SHARED_IMPORTS, PeriodoSelectComponent, CurrencyInputComponent],
  templateUrl: './gasto-list.component.html',
  styleUrl: './gasto-list.component.scss'
})
export class GastoListComponent {

   periodos = this.periodoService.getPeriodos(); 
   defaultPeriodo: Date | null = null; 
   countGastos = 0;

   movimientoForms: Map<number, FormGroup> = new Map();
   gastos: IGasto[] = [];
  
   columnsToDisplay = ['folio', 'fecha', 'cliente', 'total', 'agente', 'opciones'];
   columnsMovtoImportes = ['neto', 'descto', 'IVA', 'ISR', 'Agente', 'IvaR', 'IvaA', 'IsrR', 'IsrA','Observa','save'];
   expandedStates: Map<IGasto, boolean> = new Map(); 
 
   private selectedPeriodo$!: BehaviorSubject<Date>;
 
   constructor(private fb: FormBuilder, private periodoService: PeriodoService, private gastoService: GastoService) { }
 
   ngOnInit() {
 
     this.defaultPeriodo = this.periodoService.getCurrentMonth();
   
     this.selectedPeriodo$ = new BehaviorSubject<Date>(this.defaultPeriodo);
 
     this.selectedPeriodo$
     .pipe(
       distinctUntilChanged(),
       switchMap(selectedValue =>
        this.gastoService.sincronizarGastos(selectedValue).pipe(
          switchMap(() => this.gastoService.getGastos(selectedValue))
        )
      )
    )
     .subscribe(  gastos => { 
       this.gastos = gastos;
       this.countGastos = gastos.length;
   
       this.gastos.forEach(gasto => {
         gasto.movimientos.forEach(movimiento => {
           this.movimientoForms.set(movimiento.idMovimiento, this.initMovimientoForm(movimiento));
         });
       });
     });
 
   }
 
   initMovimientoForm(movimiento: IMovimientos): FormGroup {
     return this.fb.group({
       idMovimiento: [movimiento.idMovimiento],
       idAgente: [movimiento.idAgente || '', Validators.required],
       neto: [movimiento.neto || 0, [Validators.required, Validators.min(0)]],
       descuento: [movimiento.descuento || 0, [Validators.required, Validators.min(0)]],
       iva: [movimiento.iva || 0, [Validators.required, Validators.min(0)]],
       isr: [movimiento.isr || 0, [Validators.required, Validators.min(0)]],
       codigoProducto: [movimiento.codigoProducto || '', Validators.required],
       nombreProducto: [movimiento.nombreProducto || '', Validators.required],
       descripcion: [movimiento.descripcion || '', ],
      //  comision: [movimiento.comision || 0],
      //  utilidad: [movimiento.utilidad || 0],
      //  utilidadRicardo: [movimiento.utilidadRicardo || 0],
      //  utilidadAngie: [movimiento.utilidadAngie || 0],
       ivaRicardo: [movimiento.ivaRicardo || 0],
       ivaAngie: [movimiento.ivaAngie || 0],
       isrRicardo: [movimiento.isrRicardo || 0],
       isrAngie: [movimiento.isrAngie || 0],
       observaciones: [movimiento.observaciones || '']
     });
   }
 
   calcComisiones(movimiento: IMovimientos): void {
     const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
     if (!movimientoForm) return;
 
     const idAgente = movimientoForm.get('idAgente')?.value || 0;
     if (idAgente === 0) {
       console.error('El agente no puede ser 0');
       return;
     }
 
     const neto = movimientoForm.get('neto')?.value || 0;
     const descuento = movimientoForm.get('descuento')?.value || 0;
     const iva = movimientoForm.get('iva')?.value || 0;
     const isr = movimientoForm.get('isr')?.value || 0;
     const comision = movimientoForm.get('comision')?.value || 0;
 
     // Calcular la utilidad base
     const utilidadBase = (neto - descuento) * (comision / 100) - isr;
 
     // Asignar la utilidad base al campo correspondiente
     movimientoForm.get('utilidad')?.setValue(utilidadBase);
 
     // Si el agente es Ricardo (idAgente = 1)
     if (idAgente === 1) {
       movimientoForm.get('utilidadRicardo')?.setValue(utilidadBase);
       movimientoForm.get('utilidadAngie')?.setValue(0);
       movimientoForm.get('ivaRicardo')?.setValue(iva);
       movimientoForm.get('ivaAngie')?.setValue(0);
       movimientoForm.get('isrRicardo')?.setValue(isr);
       movimientoForm.get('isrAngie')?.setValue(0);
     } else if (idAgente === 2) {
       // Si el agente es Angie (idAgente = 2)
       movimientoForm.get('utilidadRicardo')?.setValue(0);
       movimientoForm.get('utilidadAngie')?.setValue(utilidadBase);
       movimientoForm.get('ivaRicardo')?.setValue(0);
       movimientoForm.get('ivaAngie')?.setValue(iva);
       movimientoForm.get('isrRicardo')?.setValue(0);
       movimientoForm.get('isrAngie')?.setValue(isr);
     } else if (idAgente === 3) {
       // Si el agente es ambos (idAgente = 3)
       const utilidadDividida = utilidadBase / 2;
       movimientoForm.get('utilidadRicardo')?.setValue(utilidadDividida);
       movimientoForm.get('utilidadAngie')?.setValue(utilidadDividida);
       const ivaDividido = iva / 2;
       movimientoForm.get('ivaRicardo')?.setValue(ivaDividido);
       movimientoForm.get('ivaAngie')?.setValue(ivaDividido);
       const isrDividido = isr / 2;
       movimientoForm.get('isrRicardo')?.setValue(isrDividido);
       movimientoForm.get('isrAngie')?.setValue(isrDividido);
     }
   }
 
   onInputChange(movimientoId: number, field: string, event: Event): void {
     const movimientoForm = this.movimientoForms.get(movimientoId);
     if (!movimientoForm) return;
   
     const inputElement = event.target as HTMLInputElement;
     const value = inputElement.value;
   
     // Actualiza el valor en el formulario
     movimientoForm.get(field)?.setValue(value, { emitEvent: false });
   }
 
   updateMovimiento(movimiento: IMovimientos): void {
  
     console.log('iva R:', movimiento.ivaRicardo);
     const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
     if (!movimientoForm || movimientoForm.invalid) {
       console.error('El formulario no es válido');
       return;
     }
 
     const updatedValues = {
       // impuesto: movimientoForm.get('impuesto')?.value,
       idAgente: movimientoForm.get('idAgente')?.value,
       comision: movimientoForm.get('comision')?.value,
       utilidad: movimientoForm.get('utilidad')?.value,
       utilidadRicardo: movimientoForm.get('utilidadRicardo')?.value,
       utilidadAngie: movimientoForm.get('utilidadAngie')?.value,
       ivaRicardo: movimientoForm.get('ivaRicardo')?.value,
       ivaAngie: movimientoForm.get('ivaAngie')?.value,
       isrRicardo: movimientoForm.get('isrRicardo')?.value,
       isrAngie: movimientoForm.get('isrAngie')?.value,
       observaciones: movimientoForm.get('observaciones')?.value,
       // Agrega aquí los demás campos que necesitas actualizar
     };
   
     // Actualizar el formulario con los valores actuales
     movimientoForm.patchValue(updatedValues);
 
     movimientoForm.updateValueAndValidity();
 
     const updatedMovimiento = { ...movimiento, ...movimientoForm.value };
    //  this.facturaService.updateMovimiento(updatedMovimiento).subscribe(
    //    (response) => {
    //      console.log(' actualizado:', response.nombreProducto);
    //      // Actualiza el estado local del movimiento
    //      const factura = this.facturasPagadas.find(f => f.movimientos.some(m => m.idMovimiento === movimiento.idMovimiento));
    //      if (factura) {
    //        const movimientoIndex = factura.movimientos.findIndex(m => m.idMovimiento === movimiento.idMovimiento);
    //        if (movimientoIndex !== -1) {
    //          factura.movimientos[movimientoIndex] = updatedMovimiento;
    //        }
    //      }
    //    },
    //    (error) => {
    //      console.error('Error al actualizar el movimiento:', error);
    //    }
    //  );
   }
 
   onPeriodoChange(selectedValue: Date): void {
     this.selectedPeriodo$.next(selectedValue);
   }
 
   expandElement(element: IGasto): void {
     // Colapsar todas las filas expandidas
     this.gastos.forEach(gasto => {
       if (gasto !== element) {
         gasto.expanded = false;
       }
     });
 
     // Expandir o colapsar la fila seleccionada
     element.expanded = !element.expanded;
 
     if (element.expanded) {
       // Cargar datos del primer movimiento
       const movimiento = element.movimientos[0];
       const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
       if (movimientoForm) {
         movimientoForm.patchValue(movimiento);
       }
     }
   }
 

}

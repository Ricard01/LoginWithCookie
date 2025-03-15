import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyInputComponent } from 'src/app/shared/components/currency-input.component';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { IFactura } from '../models/factura.model';
import { FacturaService } from '../services/factura.service';

import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { distinctUntilChanged, forkJoin, switchMap } from 'rxjs';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { IMovimientos } from 'src/app/shared/models/movimientos.model';


@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [SHARED_IMPORTS, PeriodoSelectComponent,CurrencyInputComponent],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.scss'
})
export class FacturasListComponent implements OnInit {

  periodos = this.periodoService.getPeriodos(); 
  defaultPeriodo: Date | null = null; 
  countFacPagadas = 0;
  countFacPendientes = 0;
 
  movimientoForms: Map<number, FormGroup> = new Map();
  facturasPendientes: IFactura[] = [];
  facturasPagadas: IFactura[] = [];

  columnsToDisplay = ['folio', 'fecha', 'cliente','neto','iva','isr','ivaRetenido', 'total', 'agente', 'opciones']; // este es el orden de impresion de las columnas y se define en TR
  columnsMovtoImportes = ['neto', 'descto', 'IVA', 'ISR', 'Agente', 'Com', 'Uti',  'U.Ric', 'U.Ang', 'IvaR', 'IvaA', 'IsrR', 'IsrA','Observa','save'];
  expandedStates: Map<IFactura, boolean> = new Map(); 

  private selectedPeriodo$!: BehaviorSubject<Date>;

  constructor(private fb: FormBuilder, private periodoService: PeriodoService, private facturaService: FacturaService, private snackBarService: SnackbarService) { }

  get totalNeto(): number {
    return  this.facturasPagadas.reduce((sum, gasto) => sum + gasto.neto, 0);
  }
  
  get totalIva(): number {
    return this.facturasPagadas.reduce((sum, gasto) => sum + gasto.iva, 0);
  }

  get totalIsr(): number {
    return this.facturasPagadas.reduce((sum, gasto) => sum + gasto.isr, 0);
  }

  get totalIvaRetenido(): number {
    return this.facturasPagadas.reduce((sum, gasto) => sum + gasto.ivaRetenido, 0);
  }
  
  get totalGeneral(): number {
    return this.facturasPagadas.reduce((sum, gasto) => sum + gasto.total, 0);
  }

  get totalNetoPendientes(): number {
    return  this.facturasPendientes.reduce((sum, gasto) => sum + gasto.neto, 0);
  }
  
  get totalIvaPendientes(): number {
    return this.facturasPendientes.reduce((sum, gasto) => sum + gasto.iva, 0);
  }

  get totalIsrPendientes(): number {
    return this.facturasPendientes.reduce((sum, gasto) => sum + gasto.isr, 0);
  }

  get totalIvaRetenidoPendientes(): number {
    return this.facturasPendientes.reduce((sum, gasto) => sum + gasto.ivaRetenido, 0);
  }
  
  get totalGeneralPendientes(): number {
    return this.facturasPendientes.reduce((sum, gasto) => sum + gasto.total, 0);
  }

  ngOnInit() {

    this.defaultPeriodo = this.periodoService.getCurrentMonth();
  
    this.selectedPeriodo$ = new BehaviorSubject<Date>(this.defaultPeriodo);

    this.selectedPeriodo$
    .pipe(
      distinctUntilChanged(),
      switchMap(selectedValue => 
        this.facturaService.sincronizarFacturas(selectedValue).pipe( 
          switchMap(() => 
            forkJoin({
              facturasPagadas: this.facturaService.getFacturasPagadas(selectedValue), 
              facturasPendientes: this.facturaService.getFacturasPendientes(selectedValue) 
            })
          )
        )
      )
    )
    .subscribe(({ facturasPagadas, facturasPendientes }) => { 
      this.facturasPagadas = facturasPagadas;
      this.countFacPagadas = facturasPagadas.length;
  
      this.facturasPendientes = facturasPendientes;
      this.countFacPendientes = facturasPendientes.length;
  
      this.facturasPagadas.forEach(factura => {
        factura.movimientos.forEach(movimiento => {
          this.movimientoForms.set(movimiento.idMovimiento, this.initMovimientoForm(movimiento));
        });
      });

      this.facturasPendientes.forEach(factura => {
        factura.movimientos.forEach(movimiento => {
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
      comision: [movimiento.comision || 0],
      utilidad: [movimiento.utilidad || 0],
      utilidadRicardo: [movimiento.utilidadRicardo || 0],
      utilidadAngie: [movimiento.utilidadAngie || 0],
      ivaRicardo: [movimiento.ivaRicardo || 0],
      ivaAngie: [movimiento.ivaAngie || 0],
      isrRicardo: [movimiento.isrRicardo || 0],
      isrAngie: [movimiento.isrAngie || 0],
      observaciones: [movimiento.observaciones || '']
    });

  }

  isPending(factura: any): boolean {
    // Verifica si existe al menos un movimiento con utilidad = 0
    return factura.movimientos?.some((m: { idMovimiento: number; }) => this.movimientoForms.get(m.idMovimiento)?.get('utilidad')?.value === 0);
  }

  calcComisiones(movimiento: IMovimientos): void {
    const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
    if (!movimientoForm) return;
  
    const idAgente = movimientoForm.get('idAgente')?.value || 0;
    if (idAgente === 0) {
      console.error('El agente no puede ser 0');
      return;
    }
    const comision = movimientoForm.get('comision')?.value || 0;

    if (comision == 0) {
      this.snackBarService.error('La comisión no puede ser 0');
return
    } 
  
    // ✅ Obtener valores del formulario
    const neto = movimientoForm.get('neto')?.value || 0;
    const descuento = movimientoForm.get('descuento')?.value || 0;
    const iva = movimientoForm.get('iva')?.value || 0;
    const isr = movimientoForm.get('isr')?.value || 0;

  
    // ✅ Calcular la utilidad base
    const utilidadBase = (neto - descuento) * (comision / 100) - isr;

    if (utilidadBase <0) {
      this.snackBarService.error('La utilidad no puede ser menor a 0');
      return;
    }
  
    // ✅ Llamar a la función que asigna valores en función del agente
    this.asignarComisiones(movimientoForm, idAgente, utilidadBase, iva, isr);
  }
  
  private asignarComisiones(
    movimientoForm: FormGroup,
    idAgente: number,
    utilidadBase: number,
    iva: number,
    isr: number
  ): void {
    let utilidadRicardo = 0, utilidadAngie = 0;
    let ivaRicardo = 0, ivaAngie = 0;
    let isrRicardo = 0, isrAngie = 0;
  
    switch (idAgente) {
      case 1: // 🔹 Si el agente es Ricardo
        utilidadRicardo = utilidadBase;
        ivaRicardo = iva;
        isrRicardo = isr;
        break;
      case 2: // 🔹 Si el agente es Angie
        utilidadAngie = utilidadBase;
        ivaAngie = iva;
        isrAngie = isr;
        break;
      case 3: // 🔹 Si el agente es ambos (se divide entre 2)
        utilidadRicardo = utilidadBase / 2;
        utilidadAngie = utilidadBase / 2;
        ivaRicardo = iva / 2;
        ivaAngie = iva / 2;
        isrRicardo = isr / 2;
        isrAngie = isr / 2;
        break;
    }
  
    // ✅ Asignar los valores calculados
    this.setValues(movimientoForm, utilidadRicardo, utilidadAngie, ivaRicardo, ivaAngie, isrRicardo, isrAngie);
  }
  
  private setValues(
    movimientoForm: FormGroup,
    utilidadRicardo: number,
    utilidadAngie: number,
    ivaRicardo: number,
    ivaAngie: number,
    isrRicardo: number,
    isrAngie: number
  ): void {
    // 🔹 Asignar valores en los campos correctos
    movimientoForm.get('utilidad')?.setValue(utilidadRicardo + utilidadAngie);
    movimientoForm.get('utilidadRicardo')?.setValue(utilidadRicardo);
    movimientoForm.get('utilidadAngie')?.setValue(utilidadAngie);
    movimientoForm.get('ivaRicardo')?.setValue(ivaRicardo);
    movimientoForm.get('ivaAngie')?.setValue(ivaAngie);
    movimientoForm.get('isrRicardo')?.setValue(isrRicardo);
    movimientoForm.get('isrAngie')?.setValue(isrAngie);
  }
  
  calcComisionesold(movimiento: IMovimientos): void {
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
 
    this.snackBarService.success('Comision guardada con éxito');
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
   
    this.facturaService.updateMovimiento(updatedMovimiento).subscribe(
      (response) => {
        console.log('Movimiento actualizado:', response);
        this.snackBarService.success('Comision guardada con éxito');
        // Actualiza el estado local del movimiento
        const factura = this.facturasPagadas.find(f => f.movimientos.some(m => m.idMovimiento === movimiento.idMovimiento));
        if (factura) {
          const movimientoIndex = factura.movimientos.findIndex(m => m.idMovimiento === movimiento.idMovimiento);
          if (movimientoIndex !== -1) {
            factura.movimientos[movimientoIndex] = updatedMovimiento;
          }
        }
      },
      (error) => {
        console.error('Error al actualizar el movimiento:', error);
      }
    );
    
  }

  onPeriodoChange(selectedValue: Date): void {
    this.selectedPeriodo$.next(selectedValue);
  }

  expandElement(element: IFactura): void {
    // Determinar si la factura es de facturasPagadas o facturasPendientes
    const esPagada = this.facturasPagadas.includes(element);
    const facturas = esPagada ? this.facturasPagadas : this.facturasPendientes;
  
    // Colapsar todas las filas expandidas en la tabla correspondiente
    facturas.forEach(factura => {
      if (factura !== element) {
        factura.expanded = false;
      }
    });
  
    // Expandir o colapsar la fila seleccionada
    element.expanded = !element.expanded;
  
    if (element.expanded && element.movimientos && element.movimientos.length > 0) {
      // Cargar datos del primer movimiento, asegurando que el formulario existe
      const movimiento = element.movimientos[0];
  
      if (!this.movimientoForms.has(movimiento.idMovimiento)) {
        console.error(`No se encontró un formulario para el movimiento ${movimiento.idMovimiento}`);
        return; // 🔹 Evita el error en caso de que el formulario no esté creado
      }
  
      const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
      if (movimientoForm) {
        movimientoForm.patchValue(movimiento);
      }
    }
  }
  
  

}


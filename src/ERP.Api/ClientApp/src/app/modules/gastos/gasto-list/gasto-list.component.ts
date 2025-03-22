import { Component, OnInit } from '@angular/core';
import { GastoService } from '../services/gasto.service';
import { BehaviorSubject, distinctUntilChanged, switchMap } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { IGasto } from '../models/gasto.model';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ExpandRowTableComponent } from 'src/app/shared/components/expand-row-table/expand-row-table.component';
import { ColumnDefinition } from 'src/app/shared/models/column.model';
import { IMovimientos } from 'src/app/shared/models/movimientos.model';

@Component({
  selector: 'app-gasto-list',
  standalone: true,
  imports: [PeriodoSelectComponent, ExpandRowTableComponent],
  templateUrl: './gasto-list.component.html',
  styleUrl: './gasto-list.component.scss'
})
export class GastoListComponent implements OnInit {

  periodos = this.periodoService.getPeriodos();
  defaultPeriodo: Date | null = null;

  movimientoForms: Map<number, FormGroup> = new Map();
  gastos: IGasto[] = [];

  totalColumns = [ 'total_neto','total_descuento', 'total_iva', 'total_total']
  mainColumns: ColumnDefinition[] =
    [
      { key: 'folio', header: 'Folio' },
      { key: 'fecha', header: 'Fecha', format: 'date' },
      { key: 'proveedor', header: 'Cliente' },
      { key: 'neto', header: 'Neto', format: 'currency' },
      { key: 'descuento', header: 'Descuento', format: 'currency' },
      { key: 'iva', header: 'Iva', format: 'currency' },
      { key: 'total', header: 'Total', format: 'currency' },
      { key: 'agente', header: 'Agente' }
    ];

  amountColumns: ColumnDefinition[] = [
    { key: 'neto', header: 'Neto', format: 'currency' },
    { key: 'descuento', header: 'Descto', format: 'currency' },
    { key: 'iva', header: 'IVA', format: 'currency' },
    { key: 'isr', header: 'ISR', format: 'currency' },
    { key: 'idAgente', header: 'Agente', input: true, inputType: 'number', formControlName: 'idAgente', class: 'short-input' },
    { key: 'ivaRicardo', header: 'Iva R', format: 'currency', input: true, inputType: 'number', formControlName: 'ivaRicardo', class: 'short-input' },
    { key: 'ivaAngie', header: 'Iva A', format: 'currency', input: true, inputType: 'number', formControlName: 'ivaAngie', class: 'short-input' },
    { key: 'isrRicardo', header: 'Isr R', format: 'currency', input: true, inputType: 'number', formControlName: 'isrRicardo', class: 'short-input' },
    { key: 'isrAngie', header: 'Isr A', format: 'currency', input: true, inputType: 'number', formControlName: 'isrAngie', class: 'short-input' },
    { key: 'observaciones', header: 'Observaciones', input: true, inputType: 'text', formControlName: 'observaciones', class: 'medium-input' },
    { key: 'afectaComisiones', header: 'Afecta Comision', input: true, inputType: 'number', formControlName: 'afectaComisiones', class: 'short-input' },
  ];
  expandedStates: Map<IGasto, boolean> = new Map();

  private selectedPeriodo$!: BehaviorSubject<Date>;

  constructor(private fb: FormBuilder, private periodoService: PeriodoService, private gastoService: GastoService, private snackBarService: SnackbarService) { }

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
      .subscribe(gastos => {
        console.log('gastos', gastos);
        this.gastos = gastos;
        this.setMovimientoForms(gastos);
      });

  }

  private setMovimientoForms(gastos: IGasto[]) {
    gastos.forEach(gast => {
      gast.movimientos.forEach(movimiento => {
        this.movimientoForms.set(movimiento.idMovimiento, this.initMovimientoForm(movimiento));
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
      descripcion: [movimiento.descripcion || '',],
      ivaRicardo: [movimiento.ivaRicardo || 0],
      ivaAngie: [movimiento.ivaAngie || 0],
      isrRicardo: [movimiento.isrRicardo || 0],
      isrAngie: [movimiento.isrAngie || 0],
      observaciones: [movimiento.observaciones || ''],
      afectaComisiones: [movimiento.afectaComisiones || 0],
    });
  }


  calcComisiones(movimiento: IMovimientos): void {
    const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
    if (!movimientoForm) return;

    const idAgente = movimientoForm.get('idAgente')?.value || 0;
    const iva = movimientoForm.get('iva')?.value || 0;
    const isr = movimientoForm.get('isr')?.value || 0;



    // ✅ Llamar a la función que asigna valores en función del agente
    this.asignarComisiones(movimientoForm, idAgente, iva, isr);
  }

  private asignarComisiones(
    movimientoForm: FormGroup,
    idAgente: number,
    iva: number,
    isr: number
  ): void {

    let ivaRicardo = 0, ivaAngie = 0;
    let isrRicardo = 0, isrAngie = 0;

    switch (idAgente) {
      case 0: // 🔹 Si el agente es ambos (se divide entre 2)
        ivaRicardo = iva / 2;
        ivaAngie = iva / 2;
        isrRicardo = isr / 2;
        isrAngie = isr / 2;
        break;
      case 1: // 🔹 Si el agente es Ricardo
        ivaRicardo = iva;
        isrRicardo = isr;
        break;
      case 2: // 🔹 Si el agente es Angie
        ivaAngie = iva;
        isrAngie = isr;
        break;

    }

    // ✅ Asignar los valores calculados
    this.setValues(movimientoForm, ivaRicardo, ivaAngie, isrRicardo, isrAngie);
  }

  private setValues(
    movimientoForm: FormGroup,
    ivaRicardo: number,
    ivaAngie: number,
    isrRicardo: number,
    isrAngie: number
  ): void {
    // 🔹 Asignar valores en los campos correctos

    movimientoForm.get('ivaRicardo')?.setValue(ivaRicardo);
    movimientoForm.get('ivaAngie')?.setValue(ivaAngie);
    movimientoForm.get('isrRicardo')?.setValue(isrRicardo);
    movimientoForm.get('isrAngie')?.setValue(isrAngie);
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

      idAgente: movimientoForm.get('idAgente')?.value,
      ivaRicardo: movimientoForm.get('ivaRicardo')?.value,
      ivaAngie: movimientoForm.get('ivaAngie')?.value,
      isrRicardo: movimientoForm.get('isrRicardo')?.value,
      isrAngie: movimientoForm.get('isrAngie')?.value,
      afectaComisiones: movimientoForm.get('afectaComisiones')?.value,
      observaciones: movimientoForm.get('observaciones')?.value,
      // Agrega aquí los demás campos que necesitas actualizar
    };

    // Actualizar el formulario con los valores actuales
    movimientoForm.patchValue(updatedValues);

    movimientoForm.updateValueAndValidity();

    const updatedMovimiento = { ...movimiento, ...movimientoForm.value };
    this.gastoService.updateMovtoGasto(updatedMovimiento).subscribe(
      (response) => {
        this.snackBarService.success('Informacion guardada con éxito');
        // Actualiza el estado local del movimiento
        const gasto = this.gastos.find(f => f.movimientos.some(m => m.idMovimiento === movimiento.idMovimiento));
        if (gasto) {
          const movimientoIndex = gasto.movimientos.findIndex(m => m.idMovimiento === movimiento.idMovimiento);
          if (movimientoIndex !== -1) {
            gasto.movimientos[movimientoIndex] = updatedMovimiento;
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

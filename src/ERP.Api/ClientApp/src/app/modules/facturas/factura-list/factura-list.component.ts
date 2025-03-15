import { Component } from '@angular/core';
import { PeriodoService } from 'src/app/shared/services/periodo.service';
import { FacturaService } from '../services/factura.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, forkJoin, switchMap } from 'rxjs';
import { IFactura, } from '../models/factura.model';
import { ColumnDefinition } from 'src/app/shared/models/column.model';
import { ExpandRowTableComponent } from 'src/app/shared/components/expand-row-table/expand-row-table.component';
import { PeriodoSelectComponent } from 'src/app/shared/components/periodo-select.componet';
import { IMovimientos } from 'src/app/shared/models/movimientos.model';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [ExpandRowTableComponent, PeriodoSelectComponent],
  templateUrl: './factura-list.component.html',
  styleUrl: './factura-list.component.scss'
})
export class FacturaListComponent {

  periodos = this.periodoService.getPeriodos();
  defaultPeriodo: Date | null = null;

  movimientoForms: Map<number, FormGroup> = new Map();
  facturasPendientes: IFactura[] = [];
  facturasPagadas: IFactura[] = [];

  mainColumns: ColumnDefinition[] = 
  [
    { key: 'folio', header: 'Folio' },
    { key: 'fecha', header: 'Fecha', format: 'date' },
    { key: 'cliente', header: 'Cliente'},
    { key: 'neto', header: 'Neto', format: 'currency' },
    { key: 'descuento', header: 'Descuento', format: 'currency' },
    { key: 'iva', header: 'Iva', format: 'currency' },
    { key: 'isr', header: 'Isr', format: 'currency' },
    { key: 'ivaRetenido', header: 'Iva Retenido', format: 'currency' },
    { key: 'total', header: 'Total', format: 'currency' },
    { key: 'agente', header: 'Agente' }
  ];

  amountColumns: ColumnDefinition[] = [
    { key: 'neto', header: 'Neto', format: 'currency' },
    { key: 'descuento', header: 'Descto', format: 'currency' },
    { key: 'iva', header: 'IVA', format: 'currency' },
    { key: 'isr', header: 'ISR', format: 'currency' },
    { key: 'idAgente', header: 'Agente', input: true, inputType:'number', formControlName: 'idAgente', class: 'short-input' },
    { key: 'comision', header: '% Com', input: true,inputType:'number', formControlName: 'comision', class: 'short-input' },
    { key: 'utilidad', header: 'Utilidad', format: 'currency', input: true,inputType:'number', formControlName: 'utilidad', class: 'medium-input' },
    { key: 'utilidadRicardo', header: 'U.Ric', format: 'currency', input: true,inputType:'number', formControlName: 'utilidadRicardo', class: 'medium-input'},
    { key: 'utilidadAngie', header: 'U.Ang', format: 'currency', input: true,inputType:'number', formControlName: 'utilidadAngie', class: 'medium-input' },
    { key: 'ivaRicardo', header: 'Iva R', format: 'currency', input: true,inputType:'number', formControlName: 'ivaRicardo', class: 'short-input' },
    { key: 'ivaAngie', header: 'Iva A', format: 'currency', input: true,inputType:'number', formControlName: 'ivaAngie', class: 'short-input' },
    { key: 'isrRicardo', header: 'Isr R', format: 'currency', input: true,inputType:'number', formControlName: 'isrRicardo', class: 'short-input' },
    { key: 'isrAngie', header: 'Isr A', format: 'currency', input: true,inputType:'number', formControlName: 'isrAngie', class: 'short-input' },
    { key: 'observaciones', header: 'Observaciones', input: true, inputType:'text', formControlName: 'observaciones', class: 'medium-input' },

  ];
    
  expandedStates: Map<IFactura, boolean> = new Map();

  private selectedPeriodo$!: BehaviorSubject<Date>;

  constructor(private periodoService: PeriodoService, private fb: FormBuilder, private facturaService: FacturaService, private snackBarService: SnackbarService) { }

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
        this.facturasPendientes = facturasPendientes;
        
    
        this.setMovimientoForms(facturasPagadas);
        this.setMovimientoForms(facturasPendientes);

      });
  
    }

    private setMovimientoForms(facturas: IFactura[]) {
      facturas.forEach(factura => {
        factura.movimientos.forEach(movimiento => {
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

    onPeriodoChange(selectedValue: Date): void {
      this.selectedPeriodo$.next(selectedValue);
    }
  
    expandElement(factura: IFactura): void {
      const facturas = this.facturasPagadas.includes(factura) ? this.facturasPagadas : this.facturasPendientes;
      facturas.forEach(f => {
        if (f !== factura) {
          f.expanded = false;
        }
      });
      factura.expanded = !factura.expanded;
  
      if (factura.expanded && factura.movimientos && factura.movimientos.length > 0) {
        const movimiento = factura.movimientos[0];
        if (this.movimientoForms.has(movimiento.idMovimiento)) {
          const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
          if (movimientoForm) {
            movimientoForm.patchValue(movimiento);
          }
        }
      }
    }
  

  
    updateMovimiento(movimiento: IMovimientos): void {
      const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
      if (!movimientoForm || movimientoForm.invalid) {
        console.error('El formulario no es válido');
        return;
      }
  
      const updatedValues = {
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
      };
  
      movimientoForm.patchValue(updatedValues);
      movimientoForm.updateValueAndValidity();
  
      const updatedMovimiento = { ...movimiento, ...movimientoForm.value };
  
      this.facturaService.updateMovimiento(updatedMovimiento).subscribe(
        (response) => {
          console.log('Movimiento actualizado:', response);
          this.snackBarService.success('Comision guardada con éxito');
        },
        (error) => {
          console.error('Error al actualizar el movimiento:', error);
        }
      );
    }

 

}

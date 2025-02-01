import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { IFactura, IMovimientos, IPeriodo } from '../models/factura.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacturaService } from '../services/factura.service';
import { CurrencyInputComponent } from 'src/app/shared/components/currency-input.component';


interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [SHARED_IMPORTS, CurrencyInputComponent],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.scss'
})
export class FacturasListComponent implements OnInit {


  periodos: IPeriodo[] = [
    { value: new Date('2025-01-01'), viewValue: 'Enero' },
    { value: new Date('2025-02-01'), viewValue: 'Febrero' },
    { value: new Date('2025-03-01'), viewValue: 'Marzo' },
  ];

  periodoControl = new FormControl();
  form = new FormGroup({
    periodo: this.periodoControl,
  });

 
  movimientoForms: Map<number, FormGroup> = new Map();
  facturas: IFactura[] = [];

  columnsToDisplay = ['folio', 'fecha', 'cliente', 'total', 'agente', 'opciones'];
  columnsMovtoImportes = ['neto', 'descto', 'IVA', 'ISR', 'Agente', 'Com', 'Uti',  'U.Ric', 'U.Ang', 'IvaR', 'IvaA', 'IsrR', 'IsrA','Observa','save'];
  expandedStates: Map<IFactura, boolean> = new Map(); 

  constructor(private fb: FormBuilder, private facturaService: FacturaService) { }

  ngOnInit() {
    this.onPeriodoChange({ value: this.periodos[0].value });
  }


  initMovimientoForm(movimiento: IMovimientos): FormGroup {
    return this.fb.group({
      idMovimiento: [movimiento.idMovimiento],
      idAgente: [movimiento.idAgente || '', Validators.required],
      neto: [movimiento.neto || 0, [Validators.required, Validators.min(0)]],
      descuento: [movimiento.descuento || 0, [Validators.required, Validators.min(0)]],
      impuesto: [movimiento.impuesto || 0, [Validators.required, Validators.min(0)]],
      retencion: [movimiento.retencion || 0, [Validators.required, Validators.min(0)]],
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
    const iva = movimientoForm.get('impuesto')?.value || 0;
    const isr = movimientoForm.get('retencion')?.value || 0;
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

  updateMovimiento(movimiento: IMovimientos): void {
    const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
    if (!movimientoForm || movimientoForm.invalid) {
      console.error('El formulario no es válido');
      return;
    }

    const updatedMovimiento = { ...movimiento, ...movimientoForm.value };
    this.facturaService.updateMovimiento(updatedMovimiento).subscribe(
      (response) => {
        console.log('Movimiento actualizado:', response);
        // Actualiza el estado local del movimiento
        const factura = this.facturas.find(f => f.movimientos.some(m => m.idMovimiento === movimiento.idMovimiento));
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

  // loadMovimientoData(movimiento: any): void {
  //   this.movimientoForm.patchValue(movimiento);
  // }




  onPeriodoChange(event: any): void {
    this.facturaService.get(event.value).subscribe((data: IFactura[]) => {
      this.facturas = data;
      this.facturas.forEach(factura => {
        factura.movimientos.forEach(movimiento => {
          this.movimientoForms.set(movimiento.idMovimiento, this.initMovimientoForm(movimiento));
        });
      });
    });
  }


  expandElement(element: IFactura): void {
    // Colapsar todas las filas expandidas
    this.facturas.forEach(factura => {
      if (factura !== element) {
        factura.expanded = false;
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

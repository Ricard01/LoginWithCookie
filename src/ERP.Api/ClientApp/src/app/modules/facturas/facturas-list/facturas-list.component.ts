import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from 'src/app/shared/shared.imports';
import { IFactura, IMovimientos, IPeriodo } from '../models/factura.model';
import { ActivatedRoute } from '@angular/router';
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
onSelect(index: any) {
console.log('index', index)
}

  periodos: IPeriodo[] = [
    { value: new Date('2025-01-01'), viewValue: 'Enero' },
    { value: new Date('2025-02-01'), viewValue: 'Febrero' },
    { value: new Date('2025-03-01'), viewValue: 'Marzo' },
  ];

  periodoControl = new FormControl();
  form = new FormGroup({
    periodo: this.periodoControl,
  });

  movimientoForm!: FormGroup;
  facturas: IFactura[] = [];

  columnsToDisplay = ['folio', 'fecha', 'cliente', 'total', 'agente', 'opciones'];
  expandedStates: Map<IFactura, boolean> = new Map(); // Mapa para manejar la expansión


  constructor(private fb: FormBuilder, private facturaService: FacturaService) { }
hola  (){

}
  ngOnInit() {
    this.initMovimientoForm();
  }

  initMovimientoForm(): void {
    this.movimientoForm = this.fb.group({
      idMovimiento: [''],
      idAgente: ['',],
      neto: ['', [Validators.required, Validators.min(0)]],
      descuento: ['', [Validators.required, Validators.min(0)]],
      impuesto: ['', [Validators.required, Validators.min(0)]],
      retencion: ['', [Validators.required, Validators.min(0)]],
      codigoProducto: ['', Validators.required],
      nombreProducto: ['', Validators.required],
      descripcion: ['', Validators.required],
      comision: [''],
      utilidad: [''],
      utilidadRicardo: [''],
      utilidadAngie: [''],
      ivaRicardo: [''],
      ivaAngie: [''],
      isrRicardo: [''],
      isrAngie: [''],
      observaciones: ['']
    });
  }

  // ngOnInit(): void {
  //   this.initMovimientoForm();
  //   this.facturas.forEach(factura => {
  //     factura.movimientos.forEach(movimiento => {
  //       movimiento.form = this.createMovimientoForm(movimiento); // Crear un formulario por movimiento
  //     });
  //   });
  // }
  
  // Método para crear un formulario para un movimiento
  // createMovimientoForm(movimiento: any): FormGroup {
  //   return this.fb.group({
  //     idMovimiento: [movimiento.idMovimiento],
  //     idAgente: [movimiento.idAgente],
  //     neto: [movimiento.neto, [Validators.required, Validators.min(0)]],
  //     descuento: [movimiento.descuento, [Validators.required, Validators.min(0)]],
  //     impuesto: [movimiento.impuesto, [Validators.required, Validators.min(0)]],
  //     retencion: [movimiento.retencion, [Validators.required, Validators.min(0)]],
  //     codigoProducto: [movimiento.codigoProducto, Validators.required],
  //     nombreProducto: [movimiento.nombreProducto, Validators.required],
  //     descripcion: [movimiento.descripcion, Validators.required],
  //     comision: [movimiento.comision, [Validators.required, Validators.min(0)]],
  //     utilidad: [movimiento.utilidad, [Validators.min(0)]],
  //     utilidadRicardo: [movimiento.utilidadRicardo, [Validators.min(0)]],
  //     utilidadAngie: [movimiento.utilidadAngie, [Validators.min(0)]],
  //     ivaRicardo: [movimiento.ivaRicardo, [Validators.min(0)]],
  //     ivaAngie: [movimiento.ivaAngie, [Validators.min(0)]],
  //     isrRicardo: [movimiento.isrRicardo, [Validators.min(0)]],
  //     isrAngie: [movimiento.isrAngie, [Validators.min(0)]],
  //     observaciones: [movimiento.observaciones]
  //   });
  // }

  calcComisiones(movimiento: any): void {
    // Obtener los valores necesarios del formulario y del movimiento
    const idAgente = this.movimientoForm.get('idAgente')?.value || 0;

    if (idAgente === 0) {
      console.error('El agente no puede ser 0');
      return;
    }
  
    const neto = movimiento.neto || 0;
    const descuento = movimiento.descuento || 0;
    const iva = movimiento.impuesto || 0;
    const isr = movimiento.retencion || 0;
    const comision = this.movimientoForm.get('comision')?.value || 0;


  
    // Calcular la utilidad base
    const utilidadBase = (neto - descuento) * (comision / 100) - isr;

    
  
    // Asignar la utilidad base al campo correspondiente
    this.movimientoForm.get('utilidad')?.setValue(utilidadBase);
  
    // Calcular la utilidad de Ricardo y Angie según el idAgente
    if (idAgente === 1) {
      // Si el agente es Ricardo (idAgente = 1)
      this.movimientoForm.get('utilidadRicardo')?.setValue(utilidadBase);
      this.movimientoForm.get('utilidadAngie')?.setValue(0);

      this.movimientoForm.get('ivaRicardo')?.setValue(iva);
      this.movimientoForm.get('ivaAngie')?.setValue(0);

      this.movimientoForm.get('IsrRicardo')?.setValue(isr);
      this.movimientoForm.get('IsrAngie')?.setValue(0);
    } else if (idAgente === 2) {
      // Si el agente es Angie (idAgente = 2)
      this.movimientoForm.get('utilidadRicardo')?.setValue(0);
      this.movimientoForm.get('utilidadAngie')?.setValue(utilidadBase);

      this.movimientoForm.get('ivaRicardo')?.setValue(0);
      this.movimientoForm.get('ivaAngie')?.setValue(iva);

      this.movimientoForm.get('IsrRicardo')?.setValue(0);
      this.movimientoForm.get('IsrAngie')?.setValue(isr);
    } else if (idAgente === 3) {
      // Si el agente es ambos (idAgente = 3)
      const utilidadDividida = utilidadBase / 2;
      this.movimientoForm.get('utilidadRicardo')?.setValue(utilidadDividida);
      this.movimientoForm.get('utilidadAngie')?.setValue(utilidadDividida);

      const ivaDividido = iva / 2;
      this.movimientoForm.get('ivaRicardo')?.setValue(ivaDividido);
      this.movimientoForm.get('ivaAngie')?.setValue(ivaDividido);

      const isrDividido = iva / 2;
      this.movimientoForm.get('IsrRicardo')?.setValue(isrDividido);
      this.movimientoForm.get('IsrAngie')?.setValue(isrDividido);
    }
  
  
  }

  // Carga los datos del movimiento en el formulario
  loadMovimientoData(movimiento: any): void {
    this.movimientoForm.patchValue(movimiento);
  }

  // updateMovimiento(movimiento: any): void {
  //   if (movimiento.form.invalid) {
  //     console.error('El formulario no es válido');
  //     return;
  //   }
  
  //   const updatedMovimiento = movimiento.form.value;
  
  //   this.facturaService.updateMovimiento(updatedMovimiento).subscribe(
  //     (response) => {
  //       console.log('Movimiento actualizado:', response);
  //       // Actualizar el movimiento en la lista
  //       Object.assign(movimiento, updatedMovimiento);
  //     },
  //     (error) => {
  //       console.error('Error al actualizar el movimiento:', error);
  //     }
  //   );
  // }


  updateMovimiento(movto: any): void {

    if (this.movimientoForm.invalid) {
      console.error('El formulario no es válido');
      return;
    }

    const movimiento = { ...this.movimientoForm.value as IMovimientos };
    console.log('Movimiento :', movimiento);
    this.facturaService.updateMovimiento(movimiento).subscribe(
      (response) => {
        console.log('Movimiento actualizado:', response);

        // Actualiza el estado local del movimiento
        const index = this.facturas.findIndex(f => f.movimientos.some(m => m.idMovimiento === movimiento.idMovimiento));
        if (index !== -1) {
          const movimientoIndex = this.facturas[index].movimientos.findIndex(m => m.idMovimiento === movimiento.idMovimiento);
          if (movimientoIndex !== -1) {
            this.facturas[index].movimientos[movimientoIndex] = { ...this.facturas[index].movimientos[movimientoIndex], ...movimiento };
          }
        }
      },
      (error) => {
        console.error('Error al actualizar el movimiento:', error);
      }
    );
  }


  onPeriodoChange(event: any): void {
    this.facturaService.get(event.value).subscribe((data: IFactura[]) => {
      this.facturas = data;
    }
    );
  }

  // expandElement(element: any): void {
  //   // Colapsar todas las filas expandidas
  //   this.facturas.forEach(factura => {
  //     if (factura !== element) {
  //       factura.expanded = false;
  //     }
  //   });
  
  //   // Expandir o colapsar la fila seleccionada
  //   element.expanded = !element.expanded;
  // }

  expandElement(element: IFactura): void {
    // Colapsar todas las filas expandidas
    this.facturas.forEach(factura => {
      if (factura !== element) {
        factura.expanded = false; // Colapsar otras filas
      }
    });

    // Expandir o colapsar la fila seleccionada
    element.expanded = !element.expanded;

    if (element.expanded) {
      this.loadMovimientoData(element.movimientos[0]); // Cargar datos del movimiento
    } else {
      this.movimientoForm.reset(); // Limpiar el formulario si la fila se colapsa
    }
  }


}

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
  imports: [SHARED_IMPORTS,  CurrencyInputComponent ],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.scss'
})
export class FacturasListComponent implements OnInit{
calcularImportes() {
throw new Error('Method not implemented.');
}

  
  facturas: IFactura[] = [];

  // columnsToDisplay = ['cfolio', 'crazonsocial', 'ctotal', 'expand'];
  // movementColumns = ['neto', 'descuento', 'impuesto', 'retencion'];
  // expandedElement: any | null = null;

  columnsToDisplay = ['folio','fecha', 'cliente', 'total', 'agente','opciones'];
  // dataSource = this.facturas;

  periodos: IPeriodo[] = [
    {value:new Date('2025-01-01'), viewValue: 'Enero'},
    {value: new Date('2025-02-01'), viewValue: 'Febrero'},
    {value:new Date('2025-03-01'), viewValue: 'Marzo'},
  ];
 
  periodoControl = new FormControl();

  form = new FormGroup({
    periodo: this.periodoControl,
  });
  expandedStates: Map<IFactura, boolean> = new Map(); // Mapa para manejar la expansión
  movimientoForm!: FormGroup; 

  constructor( private fb: FormBuilder,private facturaService: FacturaService, private activatedRoute: ActivatedRoute) 
  {
    // this.facturas = this.activatedRoute.snapshot.data.data; 
  }

  ngOnInit() {
    this.initMovimientoForm();
  }

    // Inicializa el formulario reactivo
    initMovimientoForm(): void {
      this.movimientoForm = this.fb.group({
        idMovimiento: [''], // Campo oculto para el ID del movimiento
        idAgente: ['', ],
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
  
    // Carga los datos del movimiento en el formulario
    loadMovimientoData(movimiento: any): void {
      this.movimientoForm.patchValue(movimiento);
    }
  
    // updateMovimiento(): void {
    //   if (this.movimientoForm.invalid) {
    //     console.error('El formulario no es válido');
    //     return;
    //   }
  
    //   const movimiento = this.movimientoForm.value;

    //   console.log('movimiento',movimiento)
  
    //   this.facturaService.updateMovimiento(movimiento).subscribe(
    //     (response) => {
    //       console.log('Movimiento actualizado:', response);
  
    //       // Actualiza el estado local del movimiento
    //       const index = this.facturas.findIndex(f => f.movimientos.some(m => m.idMovimiento === movimiento.idMovimiento));
    //       if (index !== -1) {
    //         const movimientoIndex = this.facturas[index].movimientos.findIndex(m => m.idMovimiento === movimiento.idMovimiento);
    //         if (movimientoIndex !== -1) {
    //           this.facturas[index].movimientos[movimientoIndex] = { ...this.facturas[index].movimientos[movimientoIndex], ...movimiento };
    //         }
    //       }
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
    
      // const movimiento = this.movimientoForm.value;

      const movimiento = {...this.movimientoForm.value as IMovimientos};
      console.log('Movimiento :', movimiento);
      this.facturaService.updateMovimiento( movimiento ).subscribe(
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
  // toggleRow(element: any): void {
  //   console.log('toggleRow facturas',this.facturas)
  //   this.expandedElement = this.expandedElement === element ? null : element;
  // }

}

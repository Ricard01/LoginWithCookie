import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { IFactura, IPeriodo } from '../models/factura.model';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacturaService } from '../services/factura.service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [SharedModule ],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.scss'
})
export class FacturasListComponent implements OnInit{
  
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
        comision: ['', [Validators.required, Validators.min(0)]],
        utilidad: ['', [ Validators.min(0)]],
        utilidadRicardo: ['', [ Validators.min(0)]],
        utilidadAngie: ['', [ Validators.min(0)]],
        ivaRicardo: ['', [ Validators.min(0)]],
        ivaAngie: ['', [ Validators.min(0)]],
        isrRicardo: ['', [ Validators.min(0)]],
        isrAngie: ['', [ Validators.min(0)]],
        observaciones: ['']
      });
    }
  
    // Carga los datos del movimiento en el formulario
    loadMovimientoData(movimiento: any): void {
      this.movimientoForm.patchValue(movimiento);
    }
  
    updateMovimiento(): void {
      if (this.movimientoForm.invalid) {
        console.error('El formulario no es válido');
        return;
      }
  
      const movimiento = this.movimientoForm.value;

      console.log('movimiento',movimiento)
  
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

  expandElement(element: any): void {
    element.expanded = !element.expanded;

    if (element.expanded) {
      this.loadMovimientoData(element.movimientos[0]); // Carga el primer movimiento (ajusta según tu lógica)
    }
  }

  // toggleRow(element: any): void {
  //   console.log('toggleRow facturas',this.facturas)
  //   this.expandedElement = this.expandedElement === element ? null : element;
  // }

}

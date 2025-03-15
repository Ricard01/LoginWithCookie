import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { IFactura } from 'src/app/modules/facturas/models/factura.model';
import { ColumnDefinition } from '../../models/column.model';
import { CommonModule } from '@angular/common';
import { SnackbarService } from '../../services/snackbar.service';
import { IMovimientos } from '../../models/movimientos.model';

@Component({
  selector: 'app-expand-row-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTableModule, MatExpansionModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule],
  templateUrl: './expand-row-table.component.html',
  styleUrl: './expand-row-table.component.scss'
})
export class ExpandRowTableComponent  {
  @Input() data: any[] = [];
  @Input() tableTitle: string = '';
  @Input() badgeClass: string = '';

  @Input() totalNeto: number = 110;
  @Input() totalDescto: number = 10;
  @Input() totalIva: number = 20;
  @Input() totalIsr: number =30;
  @Input() totalIvaRetenido: number = 0;
  @Input() totalGeneral: number = 0;
  @Input() totals: { [key: string]: number } = {}; 
  @Input() mainColumns: ColumnDefinition[] = [];
  @Input() totalColumns: string[] = [];
  @Input() amountColumns: ColumnDefinition[] = [];
  @Input() movimientoForms: Map<number, FormGroup> = new Map(); 
  

  @Output() expandElementEvent = new EventEmitter<any>();
  @Output() calcComisionesEvent = new EventEmitter<IMovimientos>();
  @Output() updateMovimientoEvent = new EventEmitter<IMovimientos>();


constructor(private snackBarService: SnackbarService) {
  console.log('data', this.data)
}


  formatCell(value: any, format: string): string {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  }

// En tu componente
calcularTotal(columna: string): number {
  return this.data.reduce((sum, row) => sum + (row[columna] || 0), 0);
}
 
  isPending(docto: any): boolean {
    // Verifica si existe al menos un movimiento con utilidad = 0
    return docto.movimientos?.some((m: { idMovimiento: number; }) => this.movimientoForms.get(m.idMovimiento)?.get('utilidad')?.value === 0);
  }

  expandElement(factura: any): void {
    this.expandElementEvent.emit(factura);
  }

  getTotal(facturas: IFactura[], campo: keyof IFactura): number {
    return facturas.reduce((sum, factura) => sum + (factura[campo] as number || 0), 0);
  }
  


  calcComisiones(movimiento: IMovimientos): void {
    const movimientoForm = this.movimientoForms.get(movimiento.idMovimiento);
    if (!movimientoForm) return;

    const idAgente =  Number(movimientoForm.get('idAgente')?.value || 0);
    console.log('idAgente',idAgente)

    const neto =  Number(movimientoForm.get('neto')?.value || 0);
    const descuento =  Number(movimientoForm.get('descuento')?.value || 0);
    const iva =  Number(movimientoForm.get('iva')?.value || 0);
    const isr =  Number(movimientoForm.get('isr')?.value || 0);
    const comision =  Number(movimientoForm.get('comision')?.value || 0);

    const utilidadBase = (neto - descuento) * (comision / 100) - isr;

    if (idAgente == 0 || comision == 0 ) {
      this.snackBarService.error('Comision o Agente no pueden ser 0');
      return;
    }

    this.asignarComisiones(movimientoForm, idAgente, utilidadBase, iva, isr);
  }

  updateMovimiento(movimiento: IMovimientos): void {
    this.updateMovimientoEvent.emit(movimiento);
  }

get displayedAmountColumns(): string[] {
  return this.amountColumns.map(c => c.key).concat(['opciones']);
}

get displayedMainColumns(): string[] {
  return this.mainColumns.map(c => c.key).concat(['opciones']);
}


  private asignarComisiones(movimientoForm: FormGroup, idAgente: number, utilidadBase: number, iva: number, isr: number): void {
    let utilidadRicardo = 0, utilidadAngie = 0;
    let ivaRicardo = 0, ivaAngie = 0;
    let isrRicardo = 0, isrAngie = 0;
    console.log("idAgente:", idAgente, "Tipo:", typeof idAgente);
    console.log("utilidadBase:", utilidadBase);
    console.log("iva:", iva);
    console.log("isr:", isr);
    
    switch (idAgente) {
      case 1:
        console.log("Entró en case 1");
        utilidadRicardo = utilidadBase;
        ivaRicardo = iva;
        isrRicardo = isr;
        break;
      case 2:
        console.log("Entró en case 1");
        utilidadAngie = utilidadBase;
        ivaAngie = iva;
        isrAngie = isr;
        break;
      case 3:
        console.log("Entró en case 1");
        utilidadRicardo = utilidadBase / 2;
        utilidadAngie = utilidadBase / 2;
        ivaRicardo = iva / 2;
        ivaAngie = iva / 2;
        isrRicardo = isr / 2;
        isrAngie = isr / 2;
        break;
        default:
          console.warn("⚠ No entró en ningún case. idAgente:", idAgente);
    }

    this.setValues(movimientoForm, utilidadRicardo, utilidadAngie, ivaRicardo, ivaAngie, isrRicardo, isrAngie);
  }

  private setValues(movimientoForm: FormGroup, utilidadRicardo: number, utilidadAngie: number, ivaRicardo: number, ivaAngie: number, isrRicardo: number, isrAngie: number): void {
    movimientoForm.get('utilidad')?.setValue(utilidadRicardo + utilidadAngie);
    movimientoForm.get('utilidadRicardo')?.setValue(utilidadRicardo);
    movimientoForm.get('utilidadAngie')?.setValue(utilidadAngie);
    movimientoForm.get('ivaRicardo')?.setValue(ivaRicardo);
    movimientoForm.get('ivaAngie')?.setValue(ivaAngie);
    movimientoForm.get('isrRicardo')?.setValue(isrRicardo);
    movimientoForm.get('isrAngie')?.setValue(isrAngie);
  }


}

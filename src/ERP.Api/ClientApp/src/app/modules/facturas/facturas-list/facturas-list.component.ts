import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TreeTableModule } from 'primeng/treetable';
import { IFactura } from '../models/factura.model';
import { ActivatedRoute } from '@angular/router';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [SharedModule, TreeTableModule ],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.scss'
})
export class FacturasListComponent implements OnInit{
  
 
  facturas: IFactura[];
  // columnsToDisplay = ['cfolio', 'crazonsocial', 'ctotal', 'expand'];
  movementColumns = ['cneto', 'cdescuento', 'cimpuesto', 'cretencion'];
  // expandedElement: any | null = null;

  columnsToDisplay = ['folio', 'razonSocial', 'total', 'opciones'];
  // dataSource = this.facturas;

  constructor(private activatedRoute: ActivatedRoute) 
  {
    this.facturas = this.activatedRoute.snapshot.data.data;

    console.log('ctor facturas',this.facturas)
 
  }

  ngOnInit() {

  }
  expandElement(element: any): void {
    element.expanded = !element.expanded;
  }

  // toggleRow(element: any): void {
  //   console.log('toggleRow facturas',this.facturas)
  //   this.expandedElement = this.expandedElement === element ? null : element;
  // }

}

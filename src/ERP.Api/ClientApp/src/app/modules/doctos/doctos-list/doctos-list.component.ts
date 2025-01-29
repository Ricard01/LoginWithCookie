import { AfterViewInit, ChangeDetectorRef, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { DoctosService } from '../services/doctos.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import {  IFacturas, IMovimientos } from '../models/docto.model';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-doctos-list',
    standalone: true,
    imports: [SharedModule],
    providers: [DoctosService],
    templateUrl: './doctos-list.component.html',
    styleUrl: './doctos-list.component.scss'
})
export class DoctosListComponent implements AfterViewInit {
    // isMainRow = (index: number, row: IFacturas | { detail: boolean }) => !row.hasOwnProperty('detail');
    // isDetailRow = (index: number, row: IFacturas | { detail: boolean }) => row.hasOwnProperty('detail')
    expandedRow: IFacturas | null = null;
    columns = [
        {
            columnDef: 'ciddocumento',
            header: 'Id',
            cell: (factura: IFacturas) => `${factura.ciddocumento}`,
        },
        {
            columnDef: 'cfecha',
            header: 'Fecha',
            cell: (factura: IFacturas) => `${factura.cfecha}`,
        },
        {
            columnDef: 'cfolio',
            header: 'Folio',
            cell: (factura: IFacturas) => factura.cfolio,
        },
        {
            columnDef: 'crazonsocial',
            header: 'Phone ',
            cell: (factura: IFacturas) => factura.crazonsocial,
        },

        {
            columnDef: 'cneto',
            header: 'Neto ',
            cell: (factura: IFacturas) => factura.cneto,
        },
     
    ];
    // displayedColumns = this.columns.map(c => c.columnDef).concat([ 'expandedDetail'])
    displayedColumns = [...this.columns.map(c => c.columnDef)];
    innerDisplayedColumns = ['neto'];

    // displayedColumns = this.columns
    //     .map((c) => c.columnDef)
    //     .concat(['moreOptions']);
    

  
    
 
    
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    @ViewChildren('innerTables')
    innerTables!: QueryList<MatTable<IMovimientos>>;

    @ViewChildren('innerSort')
    innerSort!: QueryList<MatSort>;

    dataSource = new MatTableDataSource<IFacturas>();
    facturas: IFacturas[];

    constructor(
        private facturaService: DoctosService,
        private router: Router,
        private ref: ChangeDetectorRef,
        // private snackBarService: SnackbarService,
        private activatedRoute: ActivatedRoute
    ) {

        this.facturas = this.activatedRoute.snapshot.data.data['doctos'];
        console.log('this.facturas', this.facturas)
    }
    toggleRow(element: IFacturas) {

        console.log('admMovientos', element.admMovimientos)
        element.admMovimientos &&
        (element.admMovimientos as MatTableDataSource<IMovimientos>).data.length

          ? (this.expandedRow =
              this.expandedRow === element ? null : element)
          : null;
        // this.ref.detectChanges();
        // this.innerTables.forEach(
        //   (table, index) =>
        //     ((table.dataSource as MatTableDataSource<Address>).sort =
        //       this.innerSort.toArray()[index])
        // );
      }
    
    // toggleRow(row: IFacturas) {
     
    //     this.expandedRow = this.expandedRow === row ? null : row;
    //   }
    
    //   isExpanded(row: IFacturas): boolean {
    //     return this.expandedRow === row;
    //   }

    //   isRowExpanded = (index: number, row: IFacturas): boolean => {
    //     return this.expandedRow === row;
    //   };
  

    ngAfterViewInit(): void {
        this.loadTableData();
    }

    loadTableData() {
        this.dataSource = new MatTableDataSource<IFacturas>(this.facturas);

        console.log('DataSource:', this.dataSource.data);
    //    console.log('admMovimientos',  this.dataSource.data.map( a => a.admMovimientos));
        // console.log('DataSource length ', this.dataSource.data.length)
        // Actualiza la visibilidad del paginador después de cargar los datos
        // this.isPaginatorVisible = this.dataSource.data.length > 0;
        this.ref.detectChanges();
        this.dataSource.paginator = this.paginator;
    }

    goToCreatePage() {
        this.router.navigate(['config/users/create']);
    }

    goToDetailPage(id: string): void {
        this.router.navigate(['config/users', id]);
    }

    deleteUser(id: string) {
        // this.doctos.delete(id).subscribe((resp: Result) => {
        //     if (resp.succeeded) {
        //         this.dataSource.data = this.dataSource.data.filter(
        //             (u: IUser) => u.id !== id
        //         );
        //         // this.snackBarService.success('User was deleted successfully');
        //     } else {
        //         // this.snackBarService.error( resp.errors.toString() );
        //     }

        // });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
}

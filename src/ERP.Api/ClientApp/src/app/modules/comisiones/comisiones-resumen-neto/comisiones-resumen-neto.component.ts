import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnInit } from '@angular/core';
import { IcomisionesPorPeriodo, IResumenComisionVm } from '../models/comision.model';
import { ComisionService } from '../services/comision.service';
import { GastoService } from '../../gastos/services/gasto.service';
import { FormGroup, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { IComentario } from 'src/app/shared/models/comentarios.model';
import { ComentarioService } from 'src/app/shared/services/comentario.service';
import { DepositoService } from 'src/app/shared/services/deposito.service';
import { IDeposito, IDepositosRequestDto } from 'src/app/shared/models/depositos.model';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comisiones-resumen-neto',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIcon, MatButtonModule],
  templateUrl: './comisiones-resumen-neto.component.html',
  styleUrl: './comisiones-resumen-neto.component.scss'
})
export class ComisionesResumenNetoComponent implements OnInit, OnChanges {
  utilidadPersonal: number = 0;
  utilidadCompartida: number = 0;
  utilidadCompartidaDivida: number = 0;
  gastosOficina: number = 0;
  utilidadTotal: number = 0;


  @Input() comision!: IResumenComisionVm;
  @Input() periodo!: Date;
  @Input() idAgente: number = 0;

  comentarioPersonalForm!: FormGroup;
  comentarioCompartidoForm!: FormGroup;
  depositosFormArray!: FormArray;
  comisionForm!: FormGroup;
  

  constructor(public fb: FormBuilder, private snackBar: SnackbarService, private comisionesService: ComisionService, private gastosService: GastoService, private comentariosService: ComentarioService, private depositosService: DepositoService) { }

  ngOnChanges() {

    if(this.periodo && this.comision) {

      this.gastosService.getGastosOficina(this.periodo).subscribe({
        next: (gastoOficina) => {
          this.gastosOficina = gastoOficina;
          this.utilidadPersonal =   (this.comision.personal.utilidad + this.comision.personal.ivaAfavor) - this.comision.personal.isrMensual;
          this.utilidadCompartida =   this.comision.compartida.utilidad - (this.comision.compartida.isrMensual + this.gastosOficina);
          this.utilidadCompartidaDivida = this.utilidadCompartida / 2;
          this.utilidadTotal = this.utilidadPersonal + this.utilidadCompartidaDivida;
        },
        error: (err) => {
          console.error('Error al obtener gastos de oficina:', err);
        }
      });

    }

  }

  ngOnInit(): void {

  
    this.initForms();
    this.loadDatos();
  }




  get totalDepositos(): number {
    return this.depositosFormArray.controls.reduce((acc, control) => {
      const importe = control.get('importe')?.value || 0;
      return acc + Number(importe);
    }, 0);
  }
  

  private calcularTotalImportes(): number {
    return this.depositosFormArray.controls.reduce((sum, ctrl) => {
      return sum + (ctrl.get('importe')?.value || 0);
    }, 0);
  }
  

  private initForms(): void {

    this.comentarioPersonalForm = this.fb.group({
      id: [''],
      idAgente: [this.idAgente],
      comentario: [''],
      
    });

    this.comentarioCompartidoForm = this.fb.group({
      id: [''],
      idAgente: [3],
      comentario: ['']
    });
  
    this.depositosFormArray = this.fb.array([
      this.createDepositoForm()
    ]);
  
    this.comisionForm = this.fb.group({
      comisionPersonal: [0, Validators.required],
      comisionCompartida: [0, Validators.required],
      totalComisionPagada: [0, Validators.required]
    });
  }
  
  private createDepositoForm(): FormGroup {
    return this.fb.group({
      id: [0],
      importe: [null, Validators.required],
      comentario: ['']
    });
  }
  

  private loadDatos(): void {
    // Comentarios
    this.comentariosService.getByIdAgenteAndPeriodo(this.idAgente, this.periodo).subscribe(res => {
     
      this.comentarioPersonalForm.patchValue({
        id: res?.id || 0,
        comentario: res?.comentario || ''
      });
    });
  
    this.comentariosService.getByIdAgenteAndPeriodo(3, this.periodo).subscribe(res => {
   
      this.comentarioCompartidoForm.patchValue({
        id:res?.id || 0,
        comentario: res?.comentario || ''
      });
    });
  
    // Depósitos
    this.depositosService.get(this.idAgente, this.periodo).subscribe(depositos => {
      if (depositos.length > 0) {
        this.depositosFormArray.clear();
        depositos.forEach(d => {

          console.log('Deposito:', d);
          this.depositosFormArray.push(this.fb.group({
            id: [d.id],
            importe: [d.importe, Validators.required],
            comentario: [d.comentario || '']
          }));
        });
      }
    });
  
    // Total
    this.comisionesService.getTotalPeriodo(this.idAgente, this.periodo).subscribe(resp => {
      console.log('getTotalPeriodo:', resp);
      this.comisionForm.patchValue(resp);
    });
  }
  
  agregarDeposito(): void {
    this.depositosFormArray.push(this.createDepositoForm());
  }

  eliminarDeposito(index: number): void {
 
    const depositoFormGroup = this.depositosFormArray.at(index) as FormGroup;
    const depositoId = depositoFormGroup.get('id')?.value;
  
    // Si el Id existe y es > 0, significa que está en BD y hay que hacer DELETE
    if (depositoId && depositoId > 0) {
      this.depositosService.delete(depositoId).subscribe({
        next: () => {
          // Una vez borrado, lo quitamos de la lista local
          this.depositosFormArray.removeAt(index);
        },
        error: (err) => {
          console.error('Error eliminando depósito', err);
        }
      });
    } else {
      // Si es un depósito nuevo que aún no se ha guardado, simplemente lo removemos localmente
      this.depositosFormArray.removeAt(index);
    }
  }
  

  guardarTodo(): void {
    const idAgente = this.idAgente;
    const periodo = this.periodo;
  
    const comentarios: IComentario[] = [
      {
        id: this.comentarioPersonalForm.get('id')?.value || 0,
        idAgente,
        periodo,
        comentario: this.comentarioPersonalForm.get('comentario')?.value
      },
      {
        id: this.comentarioCompartidoForm.get('id')?.value || 0,
        idAgente: 3, // compartido
        periodo,
        comentario: this.comentarioCompartidoForm.get('comentario')?.value
      }
    ];
  
    const depositos: IDeposito[] = this.depositosFormArray.controls.map(control => ({
      id: control.get('id')?.value || 0,
      importe: control.get('importe')?.value,
      comentario: control.get('comentario')?.value
    }));

    const depositoRequest : IDepositosRequestDto = {
      idAgente,
      periodo,
      depositos
    }
  
    const total: IcomisionesPorPeriodo = {
      idAgente,
      periodo,
      comisionPersonal: this.comisionForm.get('comisionPersonal')?.value,
      comisionCompartida: this.comisionForm.get('comisionCompartida')?.value,
      totalComisionPagada: this.comisionForm.get('total')?.value
    };
  
    forkJoin([
      ...comentarios.map(c => this.comentariosService.save(c)),
      this.depositosService.save(depositoRequest),
      this.comisionesService.saveTotals(total)
    ]).subscribe({
      next: () => this.snackBar.success('Información guardada con éxito'),
      error: () => this.snackBar.error('Error al guardar información')
    });
  }
  

}

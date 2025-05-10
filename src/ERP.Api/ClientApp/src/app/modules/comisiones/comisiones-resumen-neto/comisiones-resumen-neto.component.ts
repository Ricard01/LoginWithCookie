import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class ComisionesResumenNetoComponent implements OnChanges {
  @Input() comision!: IResumenComisionVm;
  @Input() periodo!: Date;
  @Input() idAgente = 0;

  utilidadPersonal = 0;
  utilidadCompartida = 0;
  utilidadCompartidaDivida = 0;
  gastosOficina = 0;
  utilidadTotal = 0;

  comentarioPersonalForm!: FormGroup;
  comentarioCompartidoForm!: FormGroup;
  depositosFormArray!: FormArray;
  comisionForm!: FormGroup;
  lastPeriodoStr = '';

  constructor(public fb: FormBuilder, private snackBar: SnackbarService, private comisionesService: ComisionService, private gastosService: GastoService, private comentariosService: ComentarioService, private depositosService: DepositoService) 
  { this.initForms(); }

  ngOnChanges(changes: SimpleChanges) {

     const newPeriodoStr = this.periodo?.toISOString();

  if ((changes['comision'] || changes['periodo']) 
      && this.comision && this.periodo 
      && newPeriodoStr !== this.lastPeriodoStr) {

    this.lastPeriodoStr = newPeriodoStr;
    this.loadDatos();
      }

  }

  get totalDepositos(): number {
    return (this.depositosFormArray.value as IDeposito[]).reduce((acum, dep) => {
      return acum + (dep.importe || 0);
    }, 0);
  }
  
  private initForms() {
    this.comentarioPersonalForm = this.createComentarioForm(this.idAgente);
    this.comentarioCompartidoForm = this.createComentarioForm(3);
    this.depositosFormArray = this.fb.array([this.createDepositoForm()]);
    this.comisionForm = this.createComisionForm();
  }

  private createComentarioForm(idAgente: number): FormGroup {
    return this.fb.group({
      id: [''],
      idAgente: [idAgente],
      comentario: ['']
    });
  }

  private createDepositoForm(): FormGroup {
    return this.fb.group({
      id: [0],
      importe: [null, Validators.required],
      comentario: ['']
    });
  }

  private createComisionForm(): FormGroup {
    return this.fb.group({
      comisionPersonal: [0, Validators.required],
      comisionCompartida: [0, Validators.required],
      totalComisionPagada: [0, Validators.required]
    });
  }

  private loadGastos(): void {
    this.gastosService.getGastosOficina(this.periodo).subscribe({
      next: (gastoOficina) => {
        this.gastosOficina = gastoOficina;
        this.calculateUtilities();
      },
      error: (err) => console.error('Error al obtener gastos de oficina:', err)
    });
  }

  private calculateUtilities(): void {
    this.utilidadPersonal = (this.comision.personal.utilidad + this.comision.personal.ivaAfavor) - this.comision.personal.isrMensual;
    this.utilidadCompartida = this.comision.compartida.utilidad - (this.comision.compartida.isrMensual + this.gastosOficina);
    this.utilidadCompartidaDivida = this.utilidadCompartida / 2;
    this.utilidadTotal = this.utilidadPersonal + this.utilidadCompartidaDivida;
  }

  private loadDatos(): void {
    this.loadGastos();
    this.loadComentarios();
    this.loadDepositos();
    this.loadComisionTotal();
  }

  private loadComentarios(): void {
    forkJoin([
      this.comentariosService.getByIdAgenteAndPeriodo(this.idAgente, this.periodo),
      this.comentariosService.getByIdAgenteAndPeriodo(3, this.periodo)
    ]).subscribe(([personal, compartido]) => {
      this.patchComentarioForm(this.comentarioPersonalForm, personal);
      this.patchComentarioForm(this.comentarioCompartidoForm, compartido);
    });
  }

  private patchComentarioForm(form: FormGroup, comentario: IComentario | undefined): void {
    form.patchValue({
      id: comentario?.id || 0,
      comentario: comentario?.comentario || ''
    });
  }

  private loadDepositos(): void {
    this.depositosService.get(this.idAgente, this.periodo).subscribe(depositos => {

   
      this.depositosFormArray.clear();

      if (depositos.length === 0) {
        this.depositosFormArray.push(this.createDepositoForm());
      } else {
        depositos.forEach(d => this.depositosFormArray.push(this.createDepositoFormWithData(d)));
      }
    
    });
  }

  private createDepositoFormWithData(deposito: IDeposito): FormGroup {
    return this.fb.group({
      id: [deposito.id],
      importe: [deposito.importe, Validators.required],
      comentario: [deposito.comentario || '']
    });
  }

  private loadComisionTotal(): void {
    this.comisionesService.getTotalPeriodo(this.idAgente, this.periodo)
      .subscribe(resp => this.comisionForm.patchValue(resp));
  }

  agregarDeposito(): void {
    this.depositosFormArray.push(this.createDepositoForm());
  }

  eliminarDeposito(index: number): void {
 
    const depositoId = this.depositosFormArray.at(index).get('id')?.value;
  
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

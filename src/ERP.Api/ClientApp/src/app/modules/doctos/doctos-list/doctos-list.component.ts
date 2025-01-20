import { Component } from '@angular/core';
import { DoctosService } from '../services/doctos.service';

@Component({
  selector: 'app-doctos-list',
  standalone: true,
  imports: [],
  providers: [DoctosService],
  templateUrl: './doctos-list.component.html',
  styleUrl: './doctos-list.component.scss'
})
export class DoctosListComponent {


constructor(private doctoService: DoctosService) {
this.doctoService.getAll().subscribe( resp => console.log(resp));
  
}
getAll() {
 
}

}

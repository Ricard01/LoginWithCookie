import { HttpClient } from "@angular/common/http";
import { Component } from '@angular/core';
import { AuthService } from "../../core/services/auth.service";
import { UsersService } from "../users/services/user.service";
import { CommonModule } from '@angular/common';
import { FacturaService } from '../facturas/services/factura.service';


interface City {
  name: string;
  code: string;
}
@Component({
standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  cities: City[] | undefined;

  selectedCity: City | undefined;

  resp: any;

  usersList: any

  protectedData: any;

  protectedPUT: any;

  protectedDelete: any;

  UnprotectedData: any

  constructor(private facturaS: FacturaService, private usersService: UsersService, private authService: AuthService, private http: HttpClient) {
    // this.authService.getUserSession().subscribe(resp => {
    //   this.authUser = resp;
    //   console.log('authUser', this.authUser)
    //   console.log(resp)
    //
    // });

  //   this.cities = [
  //     { name: 'New York', code: 'NY' },
  //     { name: 'Rome', code: 'RM' },
  //     { name: 'London', code: 'LDN' },
  //     { name: 'Istanbul', code: 'IST' },
  //     { name: 'Paris', code: 'PRS' }
  // ];
  this.facturaS.getComisionesR().subscribe(resp => {
    console.log(resp);  });

  }


  getClaims() {
    return this.http.get("api/auth/getClaims")
      .subscribe(resp => {
        console.log(resp)

      });
  }

  getPermissions() {
    this.authService.getUserSession().subscribe(resp => {
      console.log('permissions' + resp);
      this.resp = resp;
    })

  }


  testProtectedEndpoint(): void {
    this.authService.getProtectedData().subscribe(data => {
      this.protectedData = data;
    }, error => {
      console.error('Error fetching protected data', error);
    });
  }

  testProtectedEndpointPUT(): void {
    this.authService.getProtectedPUT().subscribe(data => {
      this.protectedPUT = data;
    }, error => {
      console.error('Error fetching protected PUT', error);
    });
  }

  testProtectedEndpointDELETE(): void {
    this.authService.getProtectedDELETE().subscribe(data => {
      this.protectedDelete = data;
    }, error => {
      console.error('Error fetching protected DELETE', error);
    });
  }

  testUnProtectedEndpoint(): void {
    this.authService.getUnProtectedData().subscribe(data => {
      this.UnprotectedData = data;
    }, error => {
      console.error('Error fetching protected data', error);
    });
  }


  getAllUsers() {
    this.usersService.getAll().subscribe(resp => {
      console.log(resp);

    })
  }
}

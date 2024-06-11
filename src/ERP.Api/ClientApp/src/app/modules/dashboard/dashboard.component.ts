import {Component} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {HttpClient} from "@angular/common/http";
import {UsersService} from "../users/services/users.service";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  resp: any;

  usersList: any

  protectedData: any;

  protectedPUT: any;

  protectedDelete: any;

  UnprotectedData: any

  constructor(private usersService: UsersService, private authService: AuthService, private http: HttpClient) {
    // this.authService.getUserSession().subscribe(resp => {
    //   this.authUser = resp;
    //   console.log('authUser', this.authUser)
    //   console.log(resp)
    //
    // });

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

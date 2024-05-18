import {Component} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  resp: any;

  protectedData: any;

  UnprotectedData: any

  constructor(private authService: AuthService, private http: HttpClient) {
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

  testUnProtectedEndpoint(): void {
    this.authService.getUnProtectedData().subscribe(data => {
      this.UnprotectedData = data;
    }, error => {
      console.error('Error fetching protected data', error);
    });
  }


}

import { Component } from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  email: any = "";
  password: any = "";
  constructor(private authService: AuthService, private http: HttpClient) {
  }
  getClaims() {
    return this.http.get("api/auth/getClaims")
      .subscribe(resp => {
        console.log(resp)

      });
  }
  getPermissions() {
    return this.http.get("api/users/GetPermissions")
      .subscribe(resp => {
        console.log(resp)

      });
  }

  login() {
    return this.authService.login( { email: this.email, password: this.password});

  }


  logout() {
    return this.authService.logOut();
  }
}

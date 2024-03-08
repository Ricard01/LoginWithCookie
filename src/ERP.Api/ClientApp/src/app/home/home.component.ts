import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../core/services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
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

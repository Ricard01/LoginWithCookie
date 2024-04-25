import {Component} from '@angular/core';
import {AuthService} from "../core/services/auth.service";

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent {

  email: any = "";
  password: any = "";


  constructor(private authService: AuthService) {
  }

  // create() {
  //   return this.authService.createUser({email: this.email, password: this.password, confirmPassword: this.password});
  // }

}

import {Component, OnInit} from '@angular/core';
import {AuthService} from "./core/services/auth.service";
import {User} from "oidc-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';



  constructor(private auth: AuthService) {
  }



  ngOnInit(): void {
    this.auth.loadClaims();

    this.user = this.auth.user;
  }

  user: any;


}

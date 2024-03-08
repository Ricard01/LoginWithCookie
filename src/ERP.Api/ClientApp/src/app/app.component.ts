import {Component, OnInit} from '@angular/core';
import {AuthService} from "./core/services/auth.service";

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

  user: any;

  constructor(private auth: AuthService) {
  }


  ngOnInit(): void {
    this.auth.loadClaims();

    this.user = this.auth.user;
  }


}

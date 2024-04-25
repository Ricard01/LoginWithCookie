import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthService} from "./core/services/auth.service";

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit, AfterViewInit {

  user: any;

  constructor(private auth: AuthService) {

  }

  ngAfterViewInit(): void {

    }


  ngOnInit(): void {

  }


}

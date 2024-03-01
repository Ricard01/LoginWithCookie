import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private usersUrl = 'api/users';

  constructor(private http: HttpClient) {
  }
  getPermissions() {
    return this.http.get("api/users/GetPermissions")
      .subscribe(resp => {
        console.log(resp)

      });
  }

}

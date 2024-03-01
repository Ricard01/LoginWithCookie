import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any = null;

  constructor(private http: HttpClient) {
  }

  loadClaims() {
    return this.http.get("api/users")
      .subscribe(user => {
        console.log(user)
        if ('username' in user) {
          this.user = user
        }
      });

  }

  login(loginForm: any) {
    return this.http.post("api/auth/login", loginForm, {withCredentials: true})
      .subscribe(_ => {
        this.loadClaims();

      });

  }

  createUser(userForm: any) {
    return this.http.post("api/auth/create", userForm, {withCredentials: true})
      .subscribe(_ => {
        this.loadClaims();

      });

  }

  logOut() {
    return this.http.get("api/auth/logout")
      .subscribe(_ => this.user = null);
  }
}

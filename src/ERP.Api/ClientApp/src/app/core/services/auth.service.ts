import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ICredentials, IAuthUser, IAuthResult} from "../models/auth-model";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'api/auth';


  constructor(private http: HttpClient) {
  }

  login(credentials: ICredentials) {
    return this.http.post(`${this.authUrl}/login`, credentials, {observe: 'response', withCredentials: true});
  }

  logOut() {
    return this.http.post<IAuthResult>(`${this.authUrl}/logout`, {});
  }

  logOutByInactivity() {
    return this.http.get<IAuthResult>(`${this.authUrl}/inactivityLogOut`, {});
  }

  getUserSession() {
    return this.http.get<IAuthUser>(`${this.authUrl}/session`);
  }

  getProtectedData() {
    return this.http.post(`${this.authUrl}/protected`,{});
  }

  getProtectedPUT() {
    return this.http.put(`${this.authUrl}/protectedPut`,{});
  }

  getProtectedDELETE() {
    return this.http.delete(`${this.authUrl}/protectedDelete`,{});
  }

  getUnProtectedData() {
    return this.http.post(`${this.authUrl}/unprotected`,{});
  }


}


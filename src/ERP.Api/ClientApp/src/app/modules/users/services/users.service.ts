import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IUser, IUserVm} from "../models/user.model";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersUrl = 'api/users';

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<IUserVm>(this.usersUrl).pipe(map(data => data.users));
  }
}

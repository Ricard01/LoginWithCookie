import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of, shareReplay, switchMap, tap} from "rxjs";
import {ICredentials, IAuthUser, IAuthResult} from "../models/auth-model";

const ANONYMOUS: IAuthUser | null = null;
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authUrl = 'api/auth';
  // isAuthenticated$: Observable<boolean>;
  private session$: Observable<IAuthUser | null> | null = null;

  constructor(private http: HttpClient) {
  }

  login(credentials: ICredentials) {

    return this.http.post<IAuthResult>(`${this.authUrl}/login`, credentials, {withCredentials: true});

  }

  getAuthenticatedUserSession() {

    return this.http.get<IAuthUser>(`${this.authUrl}/session`);

  }

  // login(credentials: ICredentials) {
  //
  //   return this.http.post<IAuthResult>(`${this.authUrl}/login`, credentials, { withCredentials: true }).pipe(
  //     switchMap(result => {
  //       if (result.isSuccess === 'true') {
  //         return this.getUserSession(true);
  //       } else {
  //         throw new Error(result.message);
  //       }
  //     }),
  //     catchError(err => of(null))  // Maneja errores generales aquí
  //   );
  //
  // }

  public getUserSession(ignoreCache: boolean = false) {

    // Invoked at application startup to check if the user has authenticated, and if so, to get and set profile data about the user.
    if (!this.session$ || ignoreCache) {

      // get the session from endpoint and set in localStore.
      this.session$ = this.http.get<IAuthUser>(`${this.authUrl}/session`).pipe(
        tap(user => {
          this.saveUser(user);
        }),
        catchError(err => {
          // If there is no current session, the user endpoint returns a response indicating that the user is anonymous By default, this is a 401 status code
          return of(ANONYMOUS);
        }),
        shareReplay(CACHE_SIZE)
      );
    }
    return this.session$;

  }


  private saveUser(user: IAuthUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private removeUser() {
    localStorage.removeItem('user');
  }

  public getIsAuthenticated(ignoreCache: boolean = false): Observable<boolean> {
    return this.getUserSession(ignoreCache).pipe(
      map(UserIsAuthenticated)
    );
  }

  public getIsAnonymous(ignoreCache: boolean = false): Observable<boolean> {
    return this.getUserSession(ignoreCache).pipe(
      map(UserIsAnonymous)
    );
  }

}


export type Session = IAuthUser | null;

function UserIsAuthenticated(s: Session): boolean {
  return s !== null;
}

function UserIsAnonymous(s: Session): boolean {
  return s === null;
}

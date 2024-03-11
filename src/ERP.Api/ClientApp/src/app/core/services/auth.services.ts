// import {Injectable} from '@angular/core';
// import {catchError, filter, map, Observable, of, shareReplay, tap} from "rxjs";
// import {HttpClient} from "@angular/common/http";
// import {IAppState} from "../../state/app.state";
// import {UserService} from "../../modules/users/services/user.service";
// import {Guid} from "guid-typescript";
// import {IUser} from "../../modules/users/models";
// import {browserReload, loggedIn} from "../state/auth.actions";
// import {Store} from "@ngrx/store";
//
//
// const ANONYMOUS: Session = null;
// const CACHE_SIZE = 1;
//
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   isAuthenticated$: Observable<boolean>;
//   private session$: Observable<Session> | null = null
//
//   constructor(private http: HttpClient, private userService: UserService, private store: Store<IAppState>) {
//
//   }
//
//   public getSession(ignoreCache: boolean = false) {
//     // https://docs.duendesoftware.com/identityserver/v6/bff/session/management/user/
//     // The /bff/user endpoint returns data about the currently logged-on user and the session.
//     // It is typically invoked at application startup to check if the user has authenticated,
//     // and if so, to get profile data about the user.
//
//     if (!this.session$ || ignoreCache) {
//       this.session$ = this.http.get<Session>('bff/user').pipe(
//         tap(claims => {
//
//           // If there is a session (successfully loggedIn)
//           // I made a call to backend to get the infoProfile (I could use the claims but radder not because i wanna my cookie / token small )
//           if (claims) {
//
//             let id = claims.find(c => c.type === 'sub').value;
//             this.getUserProfile(id);
//           }
//
//         }),
//         catchError(err => {
//           // If there is no current session, the user endpoint returns a response indicating that the user is anonymous By default, this is a 401 status code
//           return of(ANONYMOUS);
//         }),
//
//         shareReplay(CACHE_SIZE)
//       );
//     }
//     return this.session$;
//   }
//
//
//   getUserProfile(id: string) {
//
//     // because of the AuthGuard and reloads
//     // this can be trigger multiple times so i want to check if i already have the user to skip a backend call
//     const user: IUser = JSON.parse(localStorage.getItem('user'));
//
//     if (user) {
//       this.store.dispatch(browserReload({user}));
//
//     } else {
//       this.userService.getById(Guid.parse(id))
//         .subscribe((user: IUser) => {
//           this.store.dispatch(loggedIn({user: user}))
//         });
//     }
//
//
//   }
//
//   public getIsAuthenticated(ignoreCache: boolean = false) {
//     return this.getSession(ignoreCache).pipe(
//       map(UserIsAuthenticated)
//     );
//   }
//
//
//   public getIsAnonymous(ignoreCache: boolean = false) {
//     return this.getSession(ignoreCache).pipe(
//       map(UserIsAnonymous)
//     );
//   }
//
//   public getUsername(ignoreCache: boolean = false) {
//     return this.getSession(ignoreCache).pipe(
//       filter(UserIsAuthenticated),
//       map(s => s.find(c => c.type === 'name')?.value)
//     );
//   }
//
//   public getLogoutUrl(ignoreCache: boolean = false) {
//     return this.getSession(ignoreCache).pipe(
//       filter(UserIsAuthenticated),
//       map(s => s.find(c => c.type === 'bff:logout_url')?.value)
//     );
//   }
// }
//
// export interface Claim {
//   type: string;
//   value: string;
// }
//
// export interface AuthUser {
//   name: string;
//   userName: string;
//   profilePicture: string;
// }
//
// export type Session = Claim[] | null;
//
// function UserIsAuthenticated(s: Session): s is Claim[] {
//   return s !== null;
// }
//
// function UserIsAnonymous(s: Session): s is null {
//   return s === null;
// }
//

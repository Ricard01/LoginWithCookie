import {Injectable} from "@angular/core";
import * as AuthActions from "./auth.actions";
import {catchError, exhaustMap, map, of, switchMap, tap} from "rxjs";
import {AuthService} from "../../core/services/auth.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {IAuthState} from "./auth.reducers";


// Effects are usually used to perform side effects like fetching data using HTTP, WebSockets, writing to browser storage, and more.
// Most effects are straightforward: they receive a triggering action, perform a side effect, and return an Observable stream of another
// action which indicates the result is ready. NgRx effects will then automatically dispatch that action to trigger the reducers and perform a state change.

@Injectable()
export class AuthEffects {

  onLoginSubmitted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(result => {

            // const csrfToken = result.headers.get('ANY-CSRF-TOKEN');
            // if (csrfToken) {
            //   console.log('loginSubmitREsult ' + result);
            //   localStorage.setItem('CSRF_TOKEN', csrfToken);
            // }

            return AuthActions.loadAuthUser({returnUrl: action.returnUrl});

          }),
          catchError(error => {
            const errorMessage = error.error.message || 'Unknown error occurred';
            return of(AuthActions.loginFailure({error: errorMessage}));
          })
        )
      )
    )
  );


  loadUserSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadAuthUser),
      switchMap(action =>
        this.authService.getUserSession().pipe(
          map(user => {
            localStorage.setItem('user', JSON.stringify(user));
            return AuthActions.loginSuccess({user, returnUrl: action.returnUrl})
          }),
          catchError(error => of(AuthActions.loginFailure({error: 'Failed to load user session'})))
        )
      )
    )
  );
  // https://dev.to/this-is-angular/manipulating-ngrx-effects-400d
  // Handling a pure side effect
  // Sometimes we need to perform some actions that do not impact the store, but constitute a side effect.
  // For example, we might want to redirect to a certain page when some effect is handled, without perform anything on the Store itself.
  // So we might not want to map our effect to any particular action.
  // We can achieve this by using the “tap” operator and a special option for the “createEffect” {dispatch: false}
  loginSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({returnUrl}) => {
          this.router.navigateByUrl(returnUrl);
        })
      ),
    {dispatch: false}
  );
  // In this example, we use tap to perform the side effect itself, and pass “{dispatch: false}” to the “createEffect”
  // function to indicate it does not need to dispatch anything after the side effect completes.


  logOutAndRemoveUserInStore$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logOut),
      switchMap(() => {
        return this.authService.logOut().pipe(
          tap(() => {
            localStorage.removeItem('user');
            this.router.navigate(['/login']); // Redirige al usuario a la página de login
          }),
          map(() => AuthActions.logOutSuccess()),
          catchError((error) => of(AuthActions.logOutFailure({error})))
        );
      })
    )
  );

  onBrowseReload$ = createEffect(() =>
      this.actions$.pipe(
        ofType('@ngrx/effects/init'), // Acción especial que NgRx Effects despacha cuando se inicializa
        tap(() => {
          console.log('onBrowseReload Effects');
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          if (user) {
            this.store.dispatch(AuthActions.browseReload({user}));
          }
        })
      ),
    {dispatch: false}
  );


  // logOut$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(AuthActions.logOut),
  //     tap(() => console.log('LogOut action detected')),
  //     switchMap(() => {
  //       console.log('Inside switchMap');
  //       return this.authService.logOut().pipe(
  //         tap(() => {
  //           console.log('Logout API call successful');
  //           localStorage.removeItem('user');
  //           this.router.navigate(['/login']); // Redirige al usuario a la página de login
  //         }),
  //         map(() => ({type: '[Auth API] Logout Success'})),
  //         catchError((error) => {
  //           console.error('Logout API call failed', error);
  //           return of({type: '[Auth API] Logout Failure', error});
  //         })
  //       );
  //     })
  //   )
  // );

  constructor(private actions$: Actions, private authService: AuthService, private router: Router, private store: Store<IAuthState>) {
  }


}

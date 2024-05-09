import {Injectable} from "@angular/core";
import * as AuthActions from "./auth.actions";
import {catchError, exhaustMap, map, of, switchMap, tap} from "rxjs";
import {AuthService} from "../../core/services/auth.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";


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
            console.log('result', result);

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
          map(user => AuthActions.loginSuccess({user, returnUrl: action.returnUrl})),
          catchError(error => of(AuthActions.loginFailure({error: 'Failed to load user session'})))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({returnUrl}) => {
          this.router.navigateByUrl(returnUrl);
        })
      ),
    {dispatch: false}
  );


  // https://dev.to/this-is-angular/manipulating-ngrx-effects-400d
  // Handling a pure side effect
  // Sometimes we need to perform some actions that do not impact the store, but constitute a side effect.
  // For example, we might want to localStorege information when some effect is handled, without performi anything on the Store itself.
  // So we might not want to map our effect to any particular action.
  // We can achieve this by using the “tap” operator and a special option for the “createEffect” {dispatch: false}
  // logOut$ = createEffect(() =>
  //     this.actions$
  //       .pipe(
  //         ofType(AuthActions.logOut),
  //         tap(action => {
  //           localStorage.removeItem('user');
  //           window.location.href = "/bff/logout";
  //         })
  //       )
  //   , {dispatch: false});

  constructor(private actions$: Actions, private authService: AuthService, private router: Router) {
  }

  // In this example, we use tap to perform the side effect itself, and pass “{dispatch: false}” to the “createEffect”
  // function to indicate it does not need to dispatch anything after the side effect completes.


}

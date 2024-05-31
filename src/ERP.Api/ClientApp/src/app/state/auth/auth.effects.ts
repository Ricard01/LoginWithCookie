import {Injectable} from "@angular/core";
import * as AuthActions from "./auth.actions";
import {catchError, exhaustMap, map, of, switchMap, tap} from "rxjs";
import {AuthService} from "../../core/services/auth.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {IAuthState} from "./auth.reducers";


/*
Effects are usually used to perform side effects like fetching data using HTTP, WebSockets, writing to browser storage, and more.
Most effects are straightforward: they receive a triggering action, perform a side effect, and return an Observable stream of another
action which indicates the result is ready. NgRx effects will then automatically dispatch that action to trigger the reducers and perform a state change.

*** NgRx Tips ***
Name effects like functions.
Name the effects based on what they are doing, not based on the action they are listening to.
 */

@Injectable()
export class AuthEffects {

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(result => {


            return AuthActions.loadUserAfterLogin({returnUrl: action.returnUrl});

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
      ofType(AuthActions.loadUserAfterLogin),
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

  // Effect to handle redirection after login success
  redirectToReturnUrl$  = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({returnUrl}) => {
          this.router.navigateByUrl(returnUrl);
        })
      ),
    {dispatch: false} // function to indicate it does not need to dispatch anything after the side effect completes.
  );
  // In this example, we use tap to perform the side effect itself, and pass “{dispatch: false}” to the “createEffect”

  // La inicialización de efectos tarda más de lo necesario para que se cargue cuando se abre una nueva pestaña.
  // En teoría con esto no necesitaría hacer nada en app component
  // loadUserFromLocalStorage$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType('@ngrx/effects/init'), // Acción especial que NgRx Effects despacha cuando se inicializa
  //       tap(() => {
  //         console.log('loadUserFromLocalStorage Effects');
  //         const user = JSON.parse(localStorage.getItem('user') || 'null');
  //         if (user) {
  //           this.store.dispatch(AuthActions.loadUserFromLocalStorage({user}));
  //         }
  //       })
  //     ),
  //   {dispatch: false}
  // );

  // loadUserFromLocalStorage$ = createEffect(() =>
  //     this.actions$.pipe(
  //       ofType('@ngrx/effects/init'),
  //       tap(() => {
  //         console.log('NgRx Effects init triggered');
  //         const user = JSON.parse(localStorage.getItem('user') || 'null');
  //         if (user) {
  //           console.log('User found in localStorage:', user);
  //           this.store.dispatch(AuthActions.loadUserFromLocalStorage({ user }));
  //         } else {
  //           console.log('No user found in localStorage');
  //         }
  //       })
  //     ),
  //   { dispatch: false }
  // );


  logOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logOut),
      switchMap(() => {
        return this.authService.logOut().pipe(
          tap(() => {
            localStorage.removeItem('user');
            // localStorage.removeItem('logout-event');
            this.router.navigate(['/login']); // Redirige al usuario a la página de login
          }),
          map(() => AuthActions.logOutSuccess()),
          catchError((error) => of(AuthActions.logOutFailure({error})))
        );
      })
    )
  );

// Debido a la inactividad ya no existe la cookie asi que manejo otro tipo de lógica en el backend
  logOutByInactivity$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logOutByInactivity),
      switchMap(() => {
        return this.authService.logOutByInactivity().pipe(
          tap(() => {
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
          }),
          map(() => AuthActions.logOutSuccess()),
          catchError((error) => of(AuthActions.logOutFailure({error})))
        );
      })
    )
  );

  // Se ejecuta cuando existen multiples pestañas
  // Previamente ya hice un cierre de sesión en la pestaña "master" asi que solo redirijo al login las otras pestañas.
  redirectToLoginPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logOutInTab),
      tap(() => {
        this.router.navigate(['/login']);
      })
    ), {dispatch: false}
  );






  constructor(private actions$: Actions, private authService: AuthService, private router: Router, private store: Store<IAuthState>) {
  }

  /* https://dev.to/this-is-angular/ngrx-tips-i-needed-in-the-beginning-4hno#name-effects-like-functions


  // the name of the effect is the same as the action it listens to
readonly composerAddedSuccess$ = createEffect(
  () => {
    return this.actions$.pipe(
      ofType(composersApiActions.composerAddedSuccess),
      tap(() => this.alert.success('Composer saved successfully!'))
    );
  },
  { dispatch: false }
 );

  // the effect name describes what the effect does
readonly showSaveComposerSuccessAlert$ = createEffect(
  () => {
    return this.actions$.pipe(
      ofType(
        composersApiActions.composerAddedSuccess,
        // new action is added here
        // the rest of the effect remains the same
        composersApiActions.composerUpdatedSuccess
      ),
      tap(() => this.alert.success('Composer saved successfully!'))
    );
  },
  { dispatch: false }
);


  * */


}

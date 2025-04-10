import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {UsersService} from "../../modules/users/services/user.service";
import {IAppState} from "../app.state";
import {Store} from "@ngrx/store";
import {UsersApiActions, UsersPageActions} from "./user.actions";
import {catchError, exhaustMap, filter, map, of, switchMap, tap} from "rxjs";
import {selectLoadState} from "./user.selectors";
import {concatLatestFrom} from "@ngrx/operators";
import {SnackbarService} from "../../shared/services/snackbar.service";


@Injectable()
export class UserEffects {

  constructor(private actions$: Actions, private userService: UsersService, private store: Store<IAppState>, private snackBar: SnackbarService) {
  }


  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersPageActions.opened),
      concatLatestFrom(() => this.store.select(selectLoadState)),// Obtiene el estado de carga actual.
      filter(([, loadState]) => loadState !== 'LOADED'), // Filtra para proceder solo si el estado no es 'LOADED'.
      exhaustMap(() =>
        this.userService.getAll().pipe(
          map(users => UsersApiActions.loadedSuccess({users})),
          catchError(error => of(UsersApiActions.loadFailed({error: error.message})))
        )
      )
    )
  );

  showLoadUsersError$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(UsersApiActions.loadFailed),
      map(({error}) => UsersApiActions.errorOccurred({error})),
    )
  })

  shorErrorNotification$ = createEffect(() =>
      this.actions$.pipe(
        ofType(UsersApiActions.errorOccurred),
        tap(({error}) => {
          this.snackBar.error(`Error: ${error}`)
        })
      ),
    {dispatch: false}
  )

}

import {Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {UsersService} from "../../modules/users/services/users.service";
import {IAppState} from "../app.state";
import {Store} from "@ngrx/store";
import {UserActions} from "./user.actions";
import {catchError, map, of, switchMap, tap} from "rxjs";


@Injectable()
export class UserEffects {

  constructor(private actions$: Actions, private userService: UsersService, private store: Store<IAppState>) {
  }


  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.opened),
      tap(() => console.log('Effects loadUsers$')),
      switchMap(() =>
        this.userService.getAll().pipe(
          map(users => UserActions.usersLoadedSuccess({users})),
          catchError(error => of(UserActions.usersLoadedFailure({error})))
        )
      )
    )
  );


}

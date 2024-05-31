import {createReducer, on} from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import {IAuthUser} from "../../core/models/auth-model";
import {loadUserFromLocalStorage, logOutByInactivity, logOutInTab} from "./auth.actions";

/* Reducers
* Are responsible for handling transitions from one state to the next state in your application.
* Reducer functions handle these transitions by determining which actions to handle based on the action's type.
* */

export interface IAuthState {
  isLoggedIn: boolean;
  user: IAuthUser | null;
  error: string | null;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  user: null,
  error: null,
};

/* reducers executes after the dispatch
*  When an action is dispatched, all registered reducers receive the action.
*  Whether they handle the action is determined by the on functions that associate one or more actions with a given state change.
* */
export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, loadUserFromLocalStorage, (state, {user}) => ({...state, isLoggedIn: true, user, error: null,})), //En este caso, necesito el estado actual y los datos adicionales (payload) que la acción lleva para modificar el estado.
  on(AuthActions.loginFailure, (state, {error}) => ({...state, error})),
  on(AuthActions.logOutSuccess, logOutByInactivity, logOutInTab, (state) => ({...state, isLoggedIn: false, user: null, error: null})), // En este caso, la acción logOut no necesita datos adicionales, solo necesita cambiar el estado. Por eso solo se pasa state al reducer.
  on(AuthActions.logOutFailure, (state, {error}) => ({...state, error})),

);

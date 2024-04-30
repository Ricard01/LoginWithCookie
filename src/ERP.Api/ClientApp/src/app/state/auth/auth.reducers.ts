import {IUser} from "./auth.model";
import {createReducer, on} from "@ngrx/store";
import * as AuthActions from "./auth.actions";

/* Reducers
* Are responsible for handling transitions from one state to the next state in your application.
* Reducer functions handle these transitions by determining which actions to handle based on the action's type.
* */

export interface AuthState {
  isLoggedIn: boolean;
  user: IUser | null;
  error: string | null;
}

const initialState: AuthState = {
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
  on(AuthActions.login, (state) => ({ ...state, error: null })), // What the store should do in response to the login action.
  on(AuthActions.loginSuccess, (state, { user }) => ({ ...state, isLoggedIn: true, user, error: null, })),
  on(AuthActions.loginFailure, (state, { error }) => ({ ...state, error })),
  on(AuthActions.logout, (state) => ({ ...state, user: null })),

);
import {createAction, props} from "@ngrx/store";
import {IAuthUser, ICredentials} from "../../core/models/auth-model";


export const login = createAction(
  '[Login Page] Login Form Submitted',
  props<{ credentials: ICredentials, returnUrl: string }>()
);

export const loginSuccess = createAction(
    '[Auth API] Login Success',
    props<{ user: IAuthUser, returnUrl: string }>()
  );

export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: string }>()
);

export const loadUserAfterLogin = createAction(
  '[Auth API], Load User After Login',
  props<{ returnUrl: string }>()
); // después de cargar el usuario redirige a la ruta solicitada

export const logOutSuccess = createAction(  '[Auth API] Logout Success');

export const logOutFailure = createAction(
  '[Auth API] Logout Failure',
  props<{ error: any }>()
);

export const logOut = createAction('[Header Page] User Logout');

export const logOutByInactivity = createAction('[Error Interceptor] Logout Due to Inactivity');

export const logOutInTab = createAction('[Tab Service] Logout from Tab');

export const loadUserFromLocalStorage = createAction(
  '[App Component] Load User From LocalStorage.',
  props<{  user: IAuthUser}>()
);


/* [Where Is dispatched] Description of What id oes
BEST PRACTICES  https://dev.to/this-is-angular/ngrx-tips-i-needed-in-the-beginning-4hno

ngOnInit(): void {
  this.store.dispatch({ type: '[Songs Page] Opened' });
}
"Songs Page" is the source of this action (it's dispatched from the songs page) and "Opened" is the name of the event (the songs page is opened).

Be consistent in naming actions, use "[Source] Event" pattern. Also, be descriptive in naming actions.
It could help a lot in application maintenance, especially for catching bugs.

*/



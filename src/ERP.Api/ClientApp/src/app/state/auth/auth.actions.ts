import {createAction, props} from "@ngrx/store";
import {IUser} from "./auth.model";
import {IAuthUser, ICredentials} from "../../core/models/auth-model";


// export const login = createAction('[Login Page] Login Form Submitted',props<{ email: string, password: string }>());
export const checkAuth = createAction('[App Component] Check Auth]');
export const checkAuthComplete = createAction('[App Component] Check Auth Complete', props<{isLoggedIn: boolean}>);
export const login = createAction('[Login Page] Login Form Submitted',  props<{ credentials: ICredentials, returnUrl: string }>());
export const loginSuccess = createAction('[Auth API] Login Success', props<{ user: IAuthUser | null, returnUrl: string }>());
export const loginFailure = createAction('[Auth API] Login Failure', props<{ error: string }>());
export const loadAuthUser = createAction( '[Auth API], Load Auth User', props<{ returnUrl: string }>()); // después de cargar el usuario redirige a la ruta solicitada
export const loadAuthUserFailed = createAction('[Auth API] Load Auth User Fail', props<{ error: string }>());

export const logout = createAction('[Auth API] Logout');
export const browseReload = createAction('[App Component] BrowseReload', props<{ user: IUser }>());

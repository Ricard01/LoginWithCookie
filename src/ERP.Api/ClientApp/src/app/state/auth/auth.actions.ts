import {createAction, props} from "@ngrx/store";
import {IAuthUser, ICredentials} from "../../core/models/auth-model";


export const login = createAction('[Login Page] Login Form Submitted',  props<{ credentials: ICredentials, returnUrl: string }>());
export const loginSuccess = createAction('[Auth API] Login Success', props<{ user: IAuthUser, returnUrl: string }>());
export const loginFailure = createAction('[Auth API] Login Failure', props<{ error: string }>());

export const loadAuthUser = createAction( '[Auth API], Load Auth User', props<{ returnUrl: string }>()); // después de cargar el usuario redirige a la ruta solicitada
export const loadAuthUserFailed = createAction('[Auth API] Load Auth User Fail', props<{ error: string }>());

export const logOut = createAction('[Auth API] Logout');
export const logOutSuccess = createAction('[Auth API] Logout Success');
export const logOutFailure = createAction('[Auth API] Logout Failure',  props<{ error: any }>());

export const browseReload = createAction('[App Component] BrowseReload', props<{ user: IAuthUser }>());

import {createAction, props} from "@ngrx/store";
import {IUser} from "./auth.model";
import {ICredentials} from "../../core/models/auth-model";


// export const login = createAction('[Login Page] Login Form Submitted',props<{ email: string, password: string }>());
export const login = createAction('[Login Page] Login Form Submitted', props<{ credentials: ICredentials }>());
export const loginSuccess = createAction('[Auth API] Login Success', props<{ user: IUser }>());
export const loginFailure = createAction('[Auth API] Login Failure', props<{ error: string }>());
export const logout = createAction('[Auth API] Logout');
export const browseReload = createAction('[App Component] BrowseReload', props<{ user: IUser }>());

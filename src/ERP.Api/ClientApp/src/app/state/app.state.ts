import {ActionReducer} from "@ngrx/store";
import {IAuthState} from "./auth/auth.reducers";
import {IUserState} from "./users/user.reducers";

export interface IAppState {
  authState: IAuthState;
  userState: IUserState;
}

export enum Features {
  Auth = 'auth',
  User = 'user',
  Article = 'article',
  Bookmark = 'bookmark'
}

export function loggingMetaReducer<T>(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state: T, action: any): T {
    console.log('Action:', action);
    return reducer(state, action);
  };
}

// export const reducers: ActionReducerMap<IAppState> = {
//   // router: routerReducer // enables timeTravel DevTools
// };
//
// export const metaReducers: MetaReducer<IAppState>[] = isDevMode() ? [] : [];

/** METAREDUCER
 ** (Se ejecuta antes de los reducers, pueden servir para depurar que hacen antes y durante un reducer) **


 // console.log all actions
 export function logger(reducer: ActionReducer<any>): ActionReducer<any> {
 return (state, action) => {
 console.log("state before", state);
 console.log("action", action);
 return reducer(state, action);
 }

 export const metaReducers: MetaReducer<IAppState>[] = isDevMode() ? [logger] : [];
 }

 METAREDUCER ENDS */

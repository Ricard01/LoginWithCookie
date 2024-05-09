import {createFeatureSelector, createSelector} from "@ngrx/store";
import {Features} from "../app.state";
import {IAuthState} from "./auth.reducers";

export const getAuthFeatureState = createFeatureSelector<IAuthState>(Features.Auth);

export const selectIsLoggedIn = createSelector(
  getAuthFeatureState,
  state=> state.isLoggedIn
);

export const selectUserInfo = createSelector(
  getAuthFeatureState,
  state => state.user
);

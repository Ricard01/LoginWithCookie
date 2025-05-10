import {createFeatureSelector, createSelector} from "@ngrx/store";
import {IUserState, selectAll} from "./user.reducers";
import {Features} from "../app.state";

export const getUserFeatureState = createFeatureSelector<IUserState>(Features.User);

export const selectLoadState = createSelector(
  getUserFeatureState,
  state => state.loadState
);

export const selectAllUsers = createSelector(
  getUserFeatureState,
  selectAll
)


import {createFeatureSelector} from "@ngrx/store";
import {IUserState} from "./user.reducers";
import {Features} from "../app.state";

export const getUserFeatureState = createFeatureSelector<IUserState>(Features.User);

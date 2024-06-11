import { NgModule } from '@angular/core';
import {StoreModule} from "@ngrx/store";
import {Features} from "../app.state";
import { userReducer} from "./user.reducers";

import {EffectsModule} from "@ngrx/effects";
import {UserEffects} from "./user.effects";




@NgModule({
  imports: [
    StoreModule.forFeature(Features.User, userReducer ),
    EffectsModule.forFeature([UserEffects])
  ]
})
export class UserStateModule { }

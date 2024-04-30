import {NgModule} from '@angular/core';
import {StoreModule} from "@ngrx/store";
import {Features} from "../app.state";
import {authReducer} from "./auth.reducers";
import {EffectsModule} from "@ngrx/effects";
import {AuthEffects} from "./auth.effects";


@NgModule({
  imports: [
    StoreModule.forFeature(Features.Auth, authReducer),
    EffectsModule.forFeature([AuthEffects])
  ]
})
export class AuthStateModule {
}

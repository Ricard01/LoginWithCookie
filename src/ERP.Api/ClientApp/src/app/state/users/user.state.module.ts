import { NgModule } from '@angular/core';
import {StoreModule} from "@ngrx/store";
import {Features} from "../app.state";
import { userReducer} from "./user.reducers";



@NgModule({
  imports: [
    StoreModule.forFeature(Features.User, userReducer )
  ]
})
export class UserStateModule { }

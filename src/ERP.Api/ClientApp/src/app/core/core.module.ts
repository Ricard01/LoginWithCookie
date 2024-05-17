import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthStateModule} from "../state/auth/auth.state.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthStateModule,
  ]
})
export class CoreModule {
}

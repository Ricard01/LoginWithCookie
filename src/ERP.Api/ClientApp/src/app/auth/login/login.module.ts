import {NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {Route, RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthStateModule} from "../../state/auth/auth.state.module";


const authRoutes: Route[] = [
  {path: '', component: LoginComponent}

]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RouterModule.forChild(authRoutes),
    ReactiveFormsModule,
    AuthStateModule
  ],
})
export class LoginModule {
}

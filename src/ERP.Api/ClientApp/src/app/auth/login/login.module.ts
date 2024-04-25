import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import {Route, RouterModule} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";


const authRoutes: Route[] = [
  { path: '', component: LoginComponent}

]

@NgModule({
  declarations: [
    LoginComponent
  ],
    imports: [
        RouterModule.forChild(authRoutes),
        ReactiveFormsModule
    ],
})
export class LoginModule { }

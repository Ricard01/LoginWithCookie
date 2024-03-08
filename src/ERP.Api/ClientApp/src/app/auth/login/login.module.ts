import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {Route, RouterModule} from "@angular/router";


const authRoutes: Route[] = [
  { path: '', component: LoginComponent}

]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RouterModule.forChild(authRoutes)
  ],
})
export class LoginModule { }

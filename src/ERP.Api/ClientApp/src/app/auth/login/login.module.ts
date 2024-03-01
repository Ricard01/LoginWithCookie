import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import {Route} from "@angular/router";


const route: Route[] = [
  { path: '', component: LoginComponent}

]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule
  ]
})
export class LoginModule { }

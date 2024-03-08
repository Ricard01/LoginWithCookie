import { NgModule } from '@angular/core';
import { AuthLayoutComponent } from './auth-layout.component';
import {RouterModule} from "@angular/router";




// const routes: Routes = [
//   {path: 'login', loadChildren:() => import('./login/login.module').then(m => m.LoginModule)},
// ]


@NgModule({
  declarations: [
    AuthLayoutComponent
  ],
  imports: [
    RouterModule
  ]
})
export class AuthModule { }

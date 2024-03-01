import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {CreateuserComponent} from "./createuser/createuser.component";

const routes: Routes = [
  {path: '', component: HomeComponent, pathMatch: 'full' },
  {path: 'login', loadChildren:() => import('./auth/login/login.module').then(m => m.LoginModule)},
  {path: 'create', component: CreateuserComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

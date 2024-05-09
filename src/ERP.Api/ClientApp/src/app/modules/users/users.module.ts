import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserListComponent} from "./user-list/user-list.component";
import {Route, RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";


const routes: Route[] = [
  {path: '', component: UserListComponent},
]

@NgModule({
  declarations: [UserListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class UsersModule {
}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {Route, RouterModule} from "@angular/router";
import {SharedModule} from "../../shared/shared.module";
import {UserStateModule} from "../../state/users/user.state.module";
import { DoctosListComponent } from './doctos-list/doctos-list.component';


const routes: Route[] = [
  {path: '', component: DoctosListComponent},
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,

    RouterModule.forChild(routes)
  ]
})
export class DoctosModule {
}

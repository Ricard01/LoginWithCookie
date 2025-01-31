import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "./layout/layout.component";
import {authGuard} from "./core/guards/auth.guard";




const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadComponent: () => import('./modules/dashboard/dashboard.component').then(c => c.DashboardComponent)},
      {path: 'users', loadComponent: () => import('./modules/users/user-list/user-list.component').then(c => c.UserListComponent)},
      {path: 'facturas',   loadComponent: () => import('./modules/facturas/facturas-list/facturas-list.component').then(c => c.FacturasListComponent) },
    ]
  },
  {path: 'login', loadComponent: () => import('./auth/login/login.component').then(c => c.LoginComponent)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

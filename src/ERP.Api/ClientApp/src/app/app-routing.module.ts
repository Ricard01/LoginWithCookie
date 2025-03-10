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
      {path: 'gastos',   loadComponent: () => import('./modules/gastos/gasto-list/gasto-list.component').then(c => c.GastoListComponent) },
      {path: 'comisiones',   loadComponent: () => import('./modules/comisiones/comisiones-list/comisiones-list.component').then(c => c.ComisionesListComponent) },
      {path: 'comisiones-angie',   loadComponent: () => import('./modules/comisiones/comisiones-angie/comisiones-angie.component').then(c => c.ComisionesAngieComponent) },
      {path: 'comisiones-ricardo',   loadComponent: () => import('./modules/comisiones/comisiones-ricardo/comisiones-ricardo.component').then(c => c.ComisionesRicardoComponent) },
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

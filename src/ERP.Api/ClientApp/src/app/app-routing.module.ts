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
      {path: 'facturas', loadComponent: () => import('./modules/facturas/factura-list/factura-list.component').then(c => c.FacturaListComponent) },
      {path: 'gastos',   loadComponent: () => import('./modules/gastos/gasto-list/gasto-list.component').then(c => c.GastoListComponent) },
      {path: 'gastos-detalle',   loadComponent: () => import('./modules/gastos/gastos-detalle/gastos-detalle.component').then(c => c.GastosDetalleComponent) },
      {path: 'comisiones-angie',   loadComponent: () => import('./modules/comisiones/angie/comisiones-angie/comisiones-angie.component').then(c => c.ComisionesAngieComponent) },
      {path: 'comisiones-ricardo',   loadComponent: () => import('./modules/comisiones/ricardo/comisiones-ricardo/comisiones-ricardo.component').then(c => c.ComisionesRicardoComponent) },
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

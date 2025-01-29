import {NgModule} from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {LayoutComponent} from "./layout/layout.component";
import {authGuard} from "./core/guards/auth.guard";
import { doctosResolver } from './modules/doctos/resolvers/doctos.resolver';
import { facturasResolver } from './modules/facturas/resolvers/facturas.resolver';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)},
      {path: 'users', loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule)},
      {path: 'facturas',   loadComponent: () => import('./modules/facturas/facturas-list/facturas-list.component').then((m) => m.FacturasListComponent), resolve: { data: facturasResolver} },
      {path: 'doctos',   loadComponent: () => import('./modules/doctos/doctos-list/doctos-list.component').then((m) => m.DoctosListComponent), resolve: { data: doctosResolver} },
    ]
  },
  {path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule)}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

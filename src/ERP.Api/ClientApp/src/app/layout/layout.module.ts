import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {LayoutComponent} from './layout.component';
import {HeaderComponent} from './header/header.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {RouterModule} from '@angular/router';
import {SimplebarAngularModule} from 'simplebar-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent

  ],
  imports: [
    RouterModule,
    CommonModule,
    MatIconModule,
    MatMenuModule,
    SimplebarAngularModule,
    NgOptimizedImage,

  ]
})
export class LayoutModule {
}

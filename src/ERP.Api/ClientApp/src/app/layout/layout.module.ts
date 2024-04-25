import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SimplebarAngularModule } from 'simplebar-angular';
import {BsDropdownModule} from "ngx-bootstrap/dropdown";



@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    SidebarComponent

  ],
    imports: [
        RouterModule,
        CommonModule,
        SharedModule,
        SimplebarAngularModule,
        NgOptimizedImage,

    ]
})
export class LayoutModule { }

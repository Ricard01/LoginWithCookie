import {Component} from '@angular/core';

@Component({
  selector: 'app-sidebar-logo',
  template: `
    <a class="d-inline-block text-nowrap r-full text-reset" href="/">
      <img src="./assets/images/matero.png" class="logo align-middle m-2 r-full" alt="logo"/>
      <span class="align-middle f-s-16 f-w-500 m-x-8 hide-small">Mi Empresa</span>
    </a>
  `,
  styles: `
    .logo {
      width: 1.875rem;
      height: 1.875rem;
    }

    a {
      text-decoration: none;
    }
  `,
  standalone: true,
})
export class SidebarLogoComponent {

}

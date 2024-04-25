import {Component, DoCheck, EventEmitter, OnDestroy, Output, ViewEncapsulation} from '@angular/core';
import {initDropdowns} from "flowbite";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements DoCheck {

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor() {

  }

  ngDoCheck() {

    var widthButton = (document.getElementById("userBtn") as HTMLElement).offsetWidth;

    var elems = (document.getElementsByClassName('mat-menu-panel')as HTMLCollectionOf<HTMLElement>);
    for (var i = 0; i < elems.length; i++) {
      elems[i].style.width = widthButton + "px";
    }

  }

  menuOpen: boolean = false;

  menuOpened() {
    this.menuOpen = !this.menuOpen;
  }

  menuClosed() {
    this.menuOpen = false;
  }

}

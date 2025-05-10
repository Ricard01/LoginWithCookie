import {Component, DoCheck, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {Store} from "@ngrx/store";
import * as AuthActions from "../../state/auth/auth.actions";
import {IAppState} from "../../state/app.state";
import {TabService} from "../../core/services/tab.service";
import { Observable } from 'rxjs';
import { IAuthUser } from 'src/app/core/models/auth-model';
import { selectUserInfo, selectUserViewModel } from 'src/app/state/auth/auth.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements DoCheck {

  @Output() toggleSidenav = new EventEmitter<void>();

  user$: Observable<IAuthUser>;
  constructor(public store: Store<IAppState>, private tabService: TabService) {
 

  this.user$ = this.store.select(selectUserViewModel);
  }

  ngDoCheck() {

    // var widthButton = (document.getElementById("userBtn") as HTMLElement).offsetWidth;
    //
    // var elems = (document.getElementsByClassName('mat-menu-panel') as HTMLCollectionOf<HTMLElement>);
    // for (var i = 0; i < elems.length; i++) {
    //   elems[i].style.width = widthButton + "px";
    // }

  }

  menuOpen: boolean = false;

  menuOpened() {
    this.menuOpen = !this.menuOpen;
  }

  menuClosed() {
    this.menuOpen = false;
  }

  onLogOut() {

    this.tabService.notifyOtherTabsOfLogout();

    this.store.dispatch(AuthActions.logOut());
  }

}

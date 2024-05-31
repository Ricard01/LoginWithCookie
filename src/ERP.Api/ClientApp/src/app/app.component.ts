import {Component, OnDestroy, OnInit} from '@angular/core';
import {TabService} from "./core/services/tab.service";
import {IAuthUser} from "./core/models/auth-model";
import {IAppState} from "./state/app.state";
import {Store} from "@ngrx/store";
import * as AuthActions from "./state/auth/auth.actions";

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private tabService: TabService, private store: Store<IAppState>) {
    const userJson = localStorage.getItem('user');

    // Sí se encuentra un usuario en localStorage, despachar la acción para cargarlo en el store
    if (userJson) {
      const user: IAuthUser = JSON.parse(userJson);

      // Despachar la acción browseReload para actualizar el estado de autenticación en el store
      this.store.dispatch(AuthActions.loadUserFromLocalStorage({user}));
    }

  }

  ngOnInit() {
    this.tabService.initialize();
  }

  ngOnDestroy() {
    this.tabService.destroy();
  }

}

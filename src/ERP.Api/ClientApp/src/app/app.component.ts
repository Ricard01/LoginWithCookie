import {Component} from '@angular/core';
import {IAppState} from "./state/app.state";
import {Store} from "@ngrx/store";
import {IAuthUser} from "./core/models/auth-model";
import * as AuthActions from "./state/auth/auth.actions";


@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>`
})
export class AppComponent {

  constructor(private store: Store<IAppState>) {
    // Intentar cargar el usuario desde localStorage al inicializar la aplicación
    const userJson = localStorage.getItem('user');

    // Sí se encuentra un usuario en localStorage, despachar la acción para cargarlo en el store
    if (userJson) {
      const user: IAuthUser = JSON.parse(userJson);

      // Despachar la acción browseReload para actualizar el estado de autenticación en el store
      this.store.dispatch(AuthActions.browseReload({user}));
    }

  }

}

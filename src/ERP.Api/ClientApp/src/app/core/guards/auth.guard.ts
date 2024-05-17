import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {Store} from "@ngrx/store";
import {IAppState} from "../../state/app.state";
import {selectIsLoggedIn} from "../../state/auth/auth.selectors";
import {map, take} from "rxjs";


export const authGuard: CanActivateFn = (_route, _state) => {

  const router = inject(Router);
  const store = inject(Store<IAppState>);


// Nota AppComponente influye en el flujo del Login de 2 maneras para cargar el user en Store
// 1.- Cuando se inicializa la aplicacion (cerraron la ventana y la sesion sigue siendo válida)
// 2.- Cuando el usuario actualiza o recarga la página

// Selecciona el estado de isLoggedIn desde el store
  return store.select(selectIsLoggedIn).pipe(
    // Tomar solo el primer valor emitido y luego completar el observable
    take(1),
    map(isLoggedIn => {
      // Si el usuario no está autenticado, redirigir a la página de login
      if (!isLoggedIn) {
        router.navigate(['login'], {queryParams: {returnUrl: _state.url}});
        return false;
      }
      // Permitir el acceso si el usuario está autenticado
      return true;
    })
  );
};



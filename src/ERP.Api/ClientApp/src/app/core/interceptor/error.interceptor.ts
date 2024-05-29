import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {IAppState} from "../../state/app.state";
import {logOut} from "../../state/auth/auth.actions";
import * as AuthActions from "../../state/auth/auth.actions";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private store: Store<IAppState>) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error("Error Interceptor /<br>", error);

        let errorMessage = '';
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request';
            // Manejar errores 400 aquí
            break;
          case 401:
            errorMessage = 'Unauthorized';
            // Emitir un evento de cierre de sesión
            localStorage.setItem('logout-event', Date.now().toString());
            this.store.dispatch(AuthActions.logOut());
            break;
          case 403:
            errorMessage = 'Forbidden';
            // Manejar errores 403 aquí
            break;
          case 404:
            errorMessage = 'Not Found';
            // Manejar errores 404 aquí
            break;
          default:
            errorMessage = 'An unknown error occurred';
            // Manejar otros errores aquí
            break;
        }

        // Puedes mostrar un mensaje de error global aquí si lo deseas
        console.error(errorMessage);
        return throwError(error);
      })
    );
  }
}

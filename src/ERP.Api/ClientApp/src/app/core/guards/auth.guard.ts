import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";
import {inject} from "@angular/core";
import {map} from "rxjs";

export const authGuard: CanActivateFn = (_route, _state) => {

  const router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return authService.getIsAuthenticated().pipe(
    map(isAuthenticated => {

      if (isAuthenticated) {

        return true;
      } else {
        // router.navigate(['sign-in'], {queryParams: {redirectURL}});
        router.navigate(['/login'], { queryParams: { returnUrl: _state.url }});
        // router.createUrlTree([router.parseUrl('/auth/login')], {
        //   queryParams: { loggedOut: true, origUrl: _state.url }});
        // 'window.location.href = "/bff/login";
        return false;
      }
    })
  )

};



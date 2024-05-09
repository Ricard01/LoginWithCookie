import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";


export const authGuard: CanActivateFn = (_route, _state) => {

  const router = inject(Router);
  // const authService: AuthService = inject(AuthService);

  if (localStorage.getItem('user')) {
    // User is logged in, so return true
    return true;
  }
  // User is not logged in, redirect to login page with the return URL and return false
  router.navigate(['login'], {queryParams: {returnUrl: _state.url}});
  return false;

};



// import {CanActivateFn} from '@angular/router';
// import {AuthService} from "../services/auth.service";
// import {inject} from "@angular/core";
// import {map} from "rxjs";
//
// export const authGuard: CanActivateFn = (_route, _state) => {
//
//   const authService: AuthService = inject(AuthService);
//
//   return authService.getIsAuthenticated().pipe(
//     map(isAuthenticated => {
//
//       if (isAuthenticated) {
//
//         return true;
//       } else {
//         // router.navigate(['sign-in'], {queryParams: {redirectURL}});
//         window.location.href = "/bff/login";
//         return false;
//       }
//     })
//   )
//
// };
//
//

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor() {
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const xsrfToken = this.getCookie('ANY-XSRF-TOKEN');
    if (xsrfToken) {
      const clonedRequest = req.clone({
        headers: req.headers.set('ANY-XSRF-TOKEN', xsrfToken)
      });
      console.log('Headers:', clonedRequest.headers.keys());
      return next.handle(clonedRequest);
    }
    console.log('Headers:', req.headers.keys());
    return next.handle(req);
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp(
      `(?:^|; )${name.replace(/([\.$?*|{}$begin:math:text$$end:math:text$$begin:math:display$$end:math:display$\\\/\+^])/g, '\\$1')}=([^;]*)`
    ));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

}

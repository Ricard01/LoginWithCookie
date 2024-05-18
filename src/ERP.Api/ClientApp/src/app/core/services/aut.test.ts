// public async Task<IActionResult> Login(SignInRequest signInRequest)
// {
//   if (ModelState.IsValid)
//   {
//     var result =
//       await _signInManager.PasswordSignInAsync(signInRequest.Email, signInRequest.Password, true, false);
//
//     if (result.Succeeded)
//     {
//       var tokens = _antiforgery.GetAndStoreTokens(HttpContext);
//       HttpContext.Response.Headers.Add("ANY-CSRF-TOKEN", tokens.RequestToken);
//
//       return Ok(new Response(true, "Signed in successfully"));
//     }
//   }
//
//   return BadRequest(new Response(false, "Invalid Credentials"));
// }
//
// intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//
//   const csrfToken = localStorage.getItem('CSRF_TOKEN'); // Lee el token desde el almacenamiento local
//
//   if (csrfToken) {
//     const clonedRequest = req.clone({
//       headers: req.headers.set('ANY-CSRF-TOKEN', csrfToken)
//     });
//     return next.handle(clonedRequest);
//   }
//   return next.handle(req);
//
// }
//
//
// this.authService.login(action.credentials).pipe(
//   map(result => {
//
//     const csrfToken = result.headers.get('ANY-CSRF-TOKEN');
//     if (csrfToken) {
//       console.log('loginSubmitREsult ' + result);
//       localStorage.setItem('CSRF_TOKEN', csrfToken);
//     }
//
//     return AuthActions.loadAuthUser({returnUrl: action.returnUrl});
//
//   }),

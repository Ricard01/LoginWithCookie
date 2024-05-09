import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {IAppState} from "../../state/app.state";
import {Store} from "@ngrx/store";
import {ICredentials} from "../../core/models/auth-model";
import * as AuthActions from "../../state/auth/auth.actions";
import {AuthService} from "../../core/services/auth.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent {

  returnUrl: string = '/';
  credentials: ICredentials = {email: '', password: ''};

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required]],//[Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    password: ['', [Validators.required]]
  });


  constructor(
    public store: Store<IAppState>, // la diferencia entre llamar el estado global y el estado
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) {
  }


  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLogin() {

    if (this.loginForm.valid) {

      const credentials: ICredentials = {...this.loginForm.value as ICredentials};
      this.store.dispatch(AuthActions.login({ credentials, returnUrl: this.returnUrl }));

    }
  }

  // private loadUserAndRedirect() {
  //   this.authService.getUserSession(true).subscribe({
  //     next: (user) => {
  //       if (user) {
  //         this.store.dispatch(AuthActions.loginSuccess({user}));
  //         // Redirección usando returnUrl de las credenciales
  //         this.router.navigateByUrl(this.returnUrl);
  //       } else {
  //         // Maneja el caso donde no se obtienen los datos del usuario
  //         console.error('Failed to load user data');
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error loading user session:', error);
  //     }
  //   });
  // }

  // loginUser = (loginFormValue) => {
  //   this.showError = false;
  //   const login = {...loginFormValue};
  //   const userForAuth: UserForAuthenticationDto = {
  //     email: login.username,
  //     password: login.password
  //   }
  //   this.authService.loginUser('api/accounts/login', userForAuth)
  //     .subscribe({
  //       next: (res: AuthResponseDto) => {
  //         localStorage.setItem("token", res.token);
  //         this.router.navigate([this.returnUrl]);
  //       },
  //       error: (err: HttpErrorResponse) => {
  //         this.errorMessage = err.message;
  //         this.showError = true;
  //       }
  //     })
  // }

}

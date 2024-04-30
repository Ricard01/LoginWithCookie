import {Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {IAppState} from "../../state/app.state";
import {Store} from "@ngrx/store";
import * as AuthActions from "../../state/auth/auth.actions";
import {ICredentials} from "../../core/models/auth-model";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})

export class LoginComponent {

  returnUrl: string | undefined;
  credentials: ICredentials = {email: '', password: ''};

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required]],//[Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    password: ['', [Validators.required]]
  });


  constructor(
    public store: Store<IAppState>, // la diferencia entre llamar el estado global y el estado
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) {
  }


  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLogin() {

    if (this.loginForm.valid) {
      if (this.loginForm.dirty) {

        const credentials: ICredentials = {...this.loginForm.value as ICredentials, returnUrl: this.returnUrl};

        this.store.dispatch(AuthActions.login({credentials}));
      }
    }
  }

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

import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {IAppState} from "../../state/app.state";
import {Store} from "@ngrx/store";
import {ICredentials} from "../../core/models/auth-model";
import * as AuthActions from "../../state/auth/auth.actions";
import {selectIsLoggedIn} from "../../state/auth/auth.selectors";
import {tap} from "rxjs";


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
    private route: ActivatedRoute,
    private router: Router
  ) {
  }


  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // to prevent the user going to log in if already loggedIn
    this.store.select(selectIsLoggedIn).pipe(
      tap(isLoggedIn => {
        if (isLoggedIn) {
          this.router.navigate(['dashboard']);
        }
      })
    ).subscribe()



  }

  onLogin() {

    if (this.loginForm.valid) {

      const credentials: ICredentials = {...this.loginForm.value as ICredentials};
      this.store.dispatch(AuthActions.login({credentials, returnUrl: this.returnUrl}));

    }

  }


}

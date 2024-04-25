import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../core/services/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {IUserForAuthentication} from "../../core/models/auth-model";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {

  private returnUrl: string | undefined;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required]],//[Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
    password: ['', [Validators.required]]
  });


  // showError: boolean;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  onLogin() {

    console.log('onLogin');

    if (this.loginForm.valid) {
      if (this.loginForm.dirty) {
        const user: IUserForAuthentication = {...this.loginForm.value as IUserForAuthentication};
        console.log('user', user);

        this.authService.login(user).subscribe({
          next: () => {
            this.router.navigate([this.returnUrl]);
          },
          error: (err: HttpErrorResponse) => {
            console.log('error', err)
          }
        })

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

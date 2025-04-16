import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular-pro';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import {
  LoadingButtonComponent,
  ToastModule,
  ToastComponent,
} from '@coreui/angular-pro';
import { Router } from '@angular/router';
import { GlobalobjectService } from '../../../globalobject.service';
import { LoginService } from './login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [NgStyle,
    LoadingButtonComponent,
    ReactiveFormsModule,
    FormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    ToastModule,
  ]
})
export class LoginComponent {
  constructor(
    private router: Router,
    private GlobalobjectService: GlobalobjectService,
    private LoginService: LoginService
  ) {}

  ngOnInit(): void {
    // if (this.GlobalobjectService.UserLoginResponse != null) {
    //   this.router.navigate(['/dashboard']);
    // }
  }

    //#region Toaster Variables
    showToast: boolean = false;
    ToastMessage = '';
    ToastColor = '';
    //#endregion

    customStylesValidated = false;
  showPassword: boolean = false;
  loginError: string = '';
  public loading = new Array(4);

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onChange(changeEvent: boolean, idx: number): void {
    ///console.log(changeEvent, idx)
  }

  async loginFormData(EmailAddress: any, Password: any) {
    this.loading[0] = setTimeout(() => {
      this.loading[0] = undefined;
    }, 7000);

    this.customStylesValidated = true;

    if (!EmailAddress || !Password) {
      this.loginError = 'Please Enter Email Address And Password.';
      setTimeout(() => {
        this.loginError = '';
      }, 3000);
      return;
    } else {
      
      var Body = {
        EmailAddress: EmailAddress,
        Password: Password,
      };

      console.log(Body);
      this.router.navigate(['/dashboard']);

      // await this.LoginService.login(Body).subscribe((res: any) => {
      //   clearTimeout(this.loading[0]);
      //   console.log(res.data.id);
      //   if (res.apiStatus.isSuccess) {
      //     this.showToast = true;
      //     this.ToastMessage = 'Login Successful.';
      //     this.ToastColor = 'success';

      //     sessionStorage.setItem('login', 'true');
      //     this.GlobalobjectService.UserLoginResponse = res;
      //     this.GlobalobjectService.UserID = res.data.id;
      //     localStorage.setItem('loginID', 'true');
      //     if (res.data.isConfigured) {
      //       this.router.navigate(['/dashboard']);
      //     } else {
      //       this.router.navigate(['/Integrationsettings']);
      //     }
      //   } else {
      //     this.showToast = true;
      //     this.ToastMessage = 'Invalid Username Or Password';
      //     this.ToastColor = 'danger';

      //     this.loginError = 'Invalid Username Or Password';
      //     console.log(this.loginError);
      //     localStorage.setItem('loginID', 'false');
      //     setTimeout(() => {
      //       this.loginError = '';
      //     }, 3000);

      //     this.router.navigate(['/login']);
      //   }
      // });
    }
  }

}

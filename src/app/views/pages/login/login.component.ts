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
} from '@coreui/angular-pro';
import { Router } from '@angular/router';
import { GlobalobjectService } from '../../../globalobject.service';
import { LoginService } from './login.service';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    NgxCaptchaModule,
    NgStyle,
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

  //#region Variables


  showToast = false;
  ToastMessage = '';
  ToastColor = '';
  customStylesValidated = false;
  showPassword = false;
  loginError = '';
  loading: any[] = [];
  captchaToken: string = '';
  captchaSiteKey: string = '6Ld2PSMrAAAAAOtqgfhNYQ0rTYLFhEqDTyllGTaV';
  //#endregion Variables
  
  constructor(
    private router: Router,
    private GlobalobjectService: GlobalobjectService,
    private LoginService: LoginService
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async loginFormData(email: string, password: string, captcha: string): Promise<void> {

    if (!captcha) {
      alert("Please complete the captcha.");
      return;
    }

    this.customStylesValidated = true;

    if (!email || !password) {
      this.displayError('Please Enter Email Address And Password.');
      return;
    }

    const body = { EmailAddress: email, Password: password };

    // Simulate loading
    this.loading[0] = setTimeout(() => {
      this.loading[0] = undefined;
    }, 7000);

    await this.LoginService.login(body).subscribe(
      (res: any) => {
        clearTimeout(this.loading[0]);

        console.log('Successully Logged In, Redirecting to Dashboard...');
        this.GlobalobjectService.AccessToken = res.AccessToken;
        this.GlobalobjectService.RefreshToken = res.RefreshToken;
        this.GlobalobjectService.EmailAddress = res.EmailAddress;
        
        // show toaster
        this.showToast = true;
        this.ToastMessage = 'Login Successful! Redirecting...';
        this.ToastColor = 'success';
        setTimeout(() => {
          this.showToast = false;
        }, 3000);



        this.router.navigate(['/dashboard']);
      },
      (error) => {
        clearTimeout(this.loading[0]);
        this.displayError('Login failed. Please try again.');
      }
    );
  }

  @ViewChild('captchaRef') captchaRef!: LoginComponent;
    handleCaptcha(token: string) {
      console.log('Captcha resolved with token: ', token);
    }

  private displayError(message: string): void {
    this.loginError = message;
    setTimeout(() => {
      this.loginError = '';
    }, 3000);
  }
}
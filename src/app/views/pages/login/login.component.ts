import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RecaptchaModule } from 'ng-recaptcha';
import {
  cilLockLocked,
  cilUser,
  cilLockUnlocked,
  cilLowVision,
  
} from '@coreui/icons';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  ToastModule,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  ToasterComponent,
  ToastComponent,
  ToastBodyComponent
} from '@coreui/angular-pro';

import { IconDirective } from '@coreui/icons-angular';
import { LoadingButtonComponent } from '@coreui/angular-pro';

import { LoginService } from './login.service';
import { GlobalobjectService } from '../../../globalobject.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecaptchaModule,
FormCheckComponent,
FormCheckInputDirective,
FormCheckLabelDirective,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    CardGroupComponent,

    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,

    ButtonDirective,
    LoadingButtonComponent,

    ToastModule,
     ToasterComponent,
    ToastComponent,
    ToastBodyComponent,

    IconDirective
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  showPassword = false;

  loading: any[] = [];

  showToast = false;
  ToastMessage = '';
  ToastColor = '';

captchaToken: string = '';
captchaResolved = false;
icons = {
  cilLockLocked,
  cilLowVision,
  cilLockUnlocked,
  cilUser,
  
};
togglePassword() {
  this.showPassword = !this.showPassword;
}

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    private globalObjectService: GlobalobjectService,
    private cookieService: CookieService,
     
  ){
  this.loginForm = this.fb.group({
    EmailAddress: ['', [Validators.required, Validators.email]],
    Password: ['', [Validators.required, Validators.minLength(6)]],
    // recaptcha: ['', Validators.required]  // captcha disabled for now
  });
}
captchaSiteKey: string = '6LedhuAtAAAAAB4h-nLE2TkXWCR-0CkJpT4O1GG-';
 ngOnInit(): void {

  if (
    this.cookieService.get('AccessToken') &&
    this.cookieService.get('RefreshToken')
  ) {
    this.router.navigate(['/dashboard']);
  }

}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

onCaptchaResolved(token: string | null) {
  this.captchaResolved = !!token;

  if (token) {
    this.loginForm.get('recaptcha')?.setValue(token);
  }
}
  onSubmit() {

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Captcha disabled for now
    // if (!this.captchaResolved) {
    //
    //   this.ToastColor = 'warning';
    //   this.ToastMessage = 'Please complete reCAPTCHA';
    //   this.showToast = true;
    //
    //   setTimeout(() => {
    //     this.showToast = false;
    //   }, 3000);
    //
    //   return;
    // }

    this.loading[0] = true;

    this.loginService.login(this.loginForm.value).subscribe({

      next: (res: any) => {

        this.loading[0] = false;

        if (res.APIStatus.IsSuccess) {

          this.globalObjectService.AccessToken = res.AccessToken;
          this.globalObjectService.RefreshToken = res.RefreshToken;
          this.globalObjectService.EmailAddress = res.Data.EmailAddress;

// Profile

const userProfile = {
  FirstName: res.Data.FirstName,
  LastName: res.Data.LastName,
  EmailAddress: res.Data.EmailAddress,
  MobilePhoneNumber: res.Data.MobilePhoneNumber,
  Address: res.Data.Address
};

this.globalObjectService.UserProfile = userProfile;

localStorage.setItem(
  'UserProfile',
  JSON.stringify(userProfile)
);

          const expires = new Date(
            new Date().getTime() + 15 * 60 * 1000
          );

          this.cookieService.set(
            'AccessToken',
            res.AccessToken,
            expires,
            '/'
          );

          this.cookieService.set(
            'RefreshToken',
            res.RefreshToken,
            expires,
            '/'
          );

          this.cookieService.set(
            'Client_Id',
            res.Data.Client_Id,
            expires,
            '/'
          );

          this.ToastColor = 'success';
          this.ToastMessage = 'Login Successful';

          this.showToast = true;

          setTimeout(() => {

            this.showToast = false;

            this.router.navigate(['/dashboard']);

          }, 1000);

        } else {

          this.ToastColor = 'danger';
          this.ToastMessage = res.APIStatus.Message;
          this.showToast = true;

          setTimeout(() => {
            this.showToast = false;
          }, 3000);
        }
      },

      error: () => {

        this.loading[0] = false;

        this.ToastColor = 'danger';
        this.ToastMessage = 'Login Failed';

        this.showToast = true;

        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      }

    });

  }

}
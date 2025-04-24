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
import { CaptchaService } from './captcha.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    RecaptchaModule,
    NgStyle,
    LoadingButtonComponent,
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
    NgxCaptchaModule,
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
  loginForm: FormGroup;
  captchaResolved: boolean = false;


  // constructor(

  // ) {}

  constructor(     
    private router: Router,
    private GlobalobjectService: GlobalobjectService,
    private LoginService: LoginService,
    private recaptcha: CaptchaService,
    private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      recaptcha: ['', Validators.required]
    });
  }


  onCaptchaResolved(response: string) {
    this.captchaResolved = !!response;
    this.loginForm.get('recaptcha')?.setValue(response);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Form submitted with:', formData);
      
      // Here you would typically send the data to your backend
      // Along with the recaptcha response for verification
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async loginFormData(email: string, password: string, captcha: string): Promise<void> {

    const token = await this.recaptcha.execute();
    console.log('reCAPTCHA token:', token);

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
import { Injectable } from '@angular/core';

declare const grecaptcha: any;

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor() { }

  private siteKey = '6Ld2PSMrAAAAAOtqgfhNYQ0rTYLFhEqDTyllGTaV';

  execute(action?: string): Promise<string> {
    console.log('Executing reCAPTCHA with action:', action);
    return new Promise((resolve) => {
      grecaptcha.ready(() => {
        grecaptcha.execute(this.siteKey, { action })
          .then((token: string) => resolve(token));
      });
    });
  }
}

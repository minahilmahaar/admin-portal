import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class GlobalobjectService {
  public Version = '0.0.0.0';
  public Client_Id: any;
  public APIURL: string = 'http://x2xdev.accsoft.com:3005';
  public RefreshToken: any;
  public AccessToken: any;
  public EmailAddress : any;

  onReload = new EventEmitter<void>();
  triggerOnReload(): void {
    this.onReload.emit();
  }

  constructor() {}
}

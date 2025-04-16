import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class GlobalobjectService {
  public Version = '0.0.0.0';
  public UserID: any;
  public APIURL: string = 'http://localhost:5000';
  public UserLoginResponse: any;
  public UserLoginResponseData: any;

  onReload = new EventEmitter<void>();
  triggerOnReload(): void {
    this.onReload.emit();
  }

  constructor() {}
}

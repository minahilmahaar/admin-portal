import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalobjectService } from '../../globalobject.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private GlobalobjectService: GlobalobjectService, private HttpClient: HttpClient, private CookieService: CookieService) { }

  getUsers() {
    return this.HttpClient.get(this.GlobalobjectService.APIURL + '/api/MS/Users/GetAll', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.CookieService.get('AccessToken'),
        'Accept': 'application/json'
      }
    });

  }

  registerUser(body: any) {
    {
      return this.HttpClient.post(this.GlobalobjectService.APIURL + '/api/UserManagement/User/Register', body,        {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.CookieService.get('AccessToken'),
        'Accept': 'application/json'        
      }
      });

  }
}
}

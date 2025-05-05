import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalobjectService } from '../../../globalobject.service';
import { CanActivate, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoginService implements CanActivate {
  
  constructor(
    public http: HttpClient,
    public globalObjectService: GlobalobjectService,
    public router: Router
  ) {}
  
  canActivate(): boolean {
    let isAuthenticated = this.globalObjectService.AccessToken != null;
    if (!isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  apiurlhere: any = null;
  login(body: any){
    //this.apiurlhere = this.globalObjectService.APIURL + '/api/Authentication/User/Login';
    //console.log('Login URL:', this.apiurlhere);
    return this.http.post(this.globalObjectService.APIURL + '/api/Authentication/User/Login', body);
  }
}
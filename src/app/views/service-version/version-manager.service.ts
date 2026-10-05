import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { GlobalobjectService } from '../../globalobject.service';

@Injectable({
  providedIn: 'root'
})
export class VersionManagerService {

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private global: GlobalobjectService
  ) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.cookie.get('AccessToken'),
      'Accept': 'application/json'
    });
  }

  uploadInstaller(formData: FormData): Observable<any> {
    return this.http.post(
      this.global.APIURL + 'api/VersionManager/UploadInstaller',
      formData,
      {
        headers: this.headers()
      }
    );
  }
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { GlobalobjectService } from '../../globalobject.service';

@Injectable({
  providedIn: 'root'
})
export class ClientslogsService {
  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private global: GlobalobjectService
  ) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.cookie.get('AccessToken'),
      'Accept': 'application/json'
    });
  }

  downloadAPILog(): Observable<string> {
    return this.http.get(this.global.APIURL + 'api/AdminPortal/APILogDownload', {
      headers: this.headers(),
      responseType: 'text'
    });
  }

  readServiceLog(clientServiceGUID: string): Observable<any> {
    return this.http.post(
      this.global.APIURL + 'api/AdminPortal/ReadServiceLog',
      { ClientServiceGUID: clientServiceGUID },
      { headers: this.headers() }
    );
  }
  clearAPILog(): Observable<any> {
  return this.http.get(
    this.global.APIURL + 'api/AdminPortal/APILogClear',
    {
      headers: this.headers()
    }
  );
} 
clearServiceLog(clientServiceGUID: string): Observable<any> {
  return this.http.post(
    this.global.APIURL + 'api/AdminPortal/ClearLogService',
    {
      ClientServiceGUID: clientServiceGUID
    },
    {
      headers: this.headers()
    }
  );
}
}

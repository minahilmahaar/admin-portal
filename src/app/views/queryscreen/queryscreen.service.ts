import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { GlobalobjectService } from '../../globalobject.service';

@Injectable({
  providedIn: 'root'
})
export class QueryscreenService {
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

  executeQuery(clientServiceGUID: string, sqlQuery: string): Observable<any> {
    return this.http.post(
      this.global.APIURL + 'api/AdminPortal/SQLQueryRunner',
      { ClientServiceGUID: clientServiceGUID, SqlQuery: sqlQuery },
      { headers: this.headers() }
    );
  }
}

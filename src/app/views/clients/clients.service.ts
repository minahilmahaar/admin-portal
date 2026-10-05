import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { GlobalobjectService } from '../../globalobject.service';

export interface EditClientBody {
  User_Id: number;
  FirstName?: string;
  LastName?: string;
  UserName?: string;
  UserDisplayName?: string;
  MobilePhoneNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
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

  getClients(): Observable<any> {
    return this.http.get(
      this.global.APIURL + 'api/AdminPortal/GetAllRegisteredClients',
      { headers: this.headers() }
    );
  }

  editClient(body: EditClientBody): Observable<any> {
    return this.http.post(
      this.global.APIURL + 'api/AdminPortal/EditClient',
      body,
      { headers: this.headers() }
    );
  }

  clientLogin(emailAddress: string): Observable<any> {
    return this.http.post(
      this.global.APIURL + 'api/AdminPortal/ClientLogin',
      { EmailAddress: emailAddress },
      { headers: this.headers() }
    );
  } 
  checkClientServiceStatus(clientServiceGUID: string): Observable<any> {
  return this.http.post(
    this.global.APIURL + 'api/AdminPortal/CheckClientServiceStatus',
    {
      ClientServiceGUID: clientServiceGUID
    },
    { headers: this.headers() }
  );
}
}

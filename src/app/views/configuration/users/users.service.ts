import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalobjectService } from '../../../globalobject.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

export class UserModel {
  Id!: number;
  Id_Encrypted!: string;
  UserTypes_Id!: number;
  Client_Id!: number;
  EmailAddress!: string;
  UserName!: string;
  FirstName!: string;
  LastName!: string;
  UserDisplayName!: string;
  aspUserID!: string;
  MobilePhoneNumber!: string;
  Address!: string;
  IsEmailVerified!: boolean;
  IsMobilePhoneVerified!: boolean;
  IsActive!: boolean;
  IsApproved!: boolean;
  Picture!: string;
  FailedLoginAttempts!: number;
  CreatedOnUTC!: string;
  UpdatedOnUTC!: string;
  Reserved1!: string;
  roles!: any;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private storageUserKey = 'UserData';
  UserData: UserModel = new UserModel();
  savedUserData = localStorage.getItem(this.storageUserKey);
  private selectedUserDatadataSource = new BehaviorSubject<any>(
    this.savedUserData ? JSON.parse(this.savedUserData) : null
  );
  selectedUserData = this.selectedUserDatadataSource.asObservable();

  constructor(
    private GlobalobjectService: GlobalobjectService,
    private HttpClient: HttpClient,
    private CookieService: CookieService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.CookieService.get('AccessToken'),
      Accept: 'application/json',
    });
  }

  selectedUserDataUpdate(data: any): void {
    this.selectedUserDatadataSource.next(data);
    localStorage.setItem(this.storageUserKey, JSON.stringify(data));
  }

  getUsers(): Observable<any> {
    return this.HttpClient.get(
      this.GlobalobjectService.APIURL + 'api/MS/Users/GetAll',
      { headers: this.getHeaders() }
    );
  }

  getUsersByClientId(clientId: any): Observable<any> {
    return this.HttpClient.get(
      this.GlobalobjectService.APIURL + 'api/MS/Users/GetByClient_Id/' + clientId,
      { headers: this.getHeaders() }
    );
  }

  registerUser(body: any): Observable<any> {
    return this.HttpClient.post(
      this.GlobalobjectService.APIURL + 'api/UserManagement/User/Register',
      body,
      { headers: this.getHeaders() }
    );
  }

  AssignRolesToUser(body: any): Observable<any> {
    return this.HttpClient.post(
      this.GlobalobjectService.APIURL + 'api/MS/UserRoles/AssignRolesToUser',
      body,
      { headers: this.getHeaders() }
    );
  }

  getRolesByuserId(id: any): Observable<any> {
    return this.HttpClient.get(
      this.GlobalobjectService.APIURL + 'api/MS/UserRoles/GetUserRolesByUserID/' + id,
      { headers: this.getHeaders() }
    );
  }

  editUser(UserData: any): Observable<any> {
    return this.HttpClient.post(
      this.GlobalobjectService.APIURL + 'api/UserManagement/User/Edit',
      UserData,
      { headers: this.getHeaders() }
    );
  }

  deleteUser(id: string): Observable<any> {
    return this.HttpClient.get(
      this.GlobalobjectService.APIURL + 'api/UserManagement/User/DeleteUser?Id=' + id,
      { headers: this.getHeaders() }
    );
  }

  getUserById(id: string): Observable<any> {
    return this.HttpClient.get(
      this.GlobalobjectService.APIURL + 'api/MS/Users/GetByID/' + id,
      { headers: this.getHeaders() }
    );
  }
}

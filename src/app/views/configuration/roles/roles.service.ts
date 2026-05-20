import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalobjectService } from '../../../globalobject.service';
import { CookieService } from 'ngx-cookie-service';

export class RolesModel {
  Id!: number;
  Client_Id!: number;
  RoleName!: string;
  DisplayOrder!: number;
  IsActive!: boolean;
  IsReadOnly!: boolean;
  menus!: any;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  RolesData: RolesModel = new RolesModel();

  constructor(
    private GlobalobjectService: GlobalobjectService,
    private HttpClient: HttpClient,
    private CookieService: CookieService
  ) {}

  private headers() {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.CookieService.get('AccessToken'),
      'Accept': 'application/json'
    };
  }

  GetRoles(Id: any) {
    return this.HttpClient.get(`${this.GlobalobjectService.APIURL}api/MS/Roles/GetByClientID/${Id}`, {
      headers: this.headers()
    });
  }

  getMenusByUserId() {
    return this.HttpClient.get(`${this.GlobalobjectService.APIURL}api/MS/MenusAdmin/GetAll`, {
      headers: this.headers()
    });
  }

  addRoles(body: any) {
    return this.HttpClient.post(`${this.GlobalobjectService.APIURL}api/MS/Roles/Add`, body, {
      headers: this.headers()
    });
  }

  getMenuByRoleIDAndClientID(body: any) {
    return this.HttpClient.post(`${this.GlobalobjectService.APIURL}api/MS/MenuAssignedToRoles/GetMenuByRoleIDAndClientID`, body, {
      headers: this.headers()
    });
  }

  assignMenuToRoles(body: any) {
    return this.HttpClient.post(`${this.GlobalobjectService.APIURL}api/MS/MenuAssignedToRoles/AssignMenuToRoles`, body, {
      headers: this.headers()
    });
  }

  updateRoles(body: any) {
    return this.HttpClient.post(`${this.GlobalobjectService.APIURL}api/MS/Roles/Edit`, body, {
      headers: this.headers()
    });
  }
}

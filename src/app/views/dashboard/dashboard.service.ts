import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalobjectService } from '../../globalobject.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private http = inject(HttpClient);
  private globalobjectService = inject(GlobalobjectService);

  getClientsConnectionReport() {

    const url =
      `${this.globalobjectService.APIURL}api/AdminPortal/GetClientsConnectionReport`;

    const body = {
      SkipLivePing: true
    };

    return this.http.post<any>(url, body);
  }
}